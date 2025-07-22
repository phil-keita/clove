// SignUp and Login use Firebase Auth functions.
// On auth state change, save user to context/global state.
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Divider,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Track current tab
  const [inputErrors, setInputErrors] = useState({});
  const { login, signup, loginWithGoogle, error, clearError, currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Redirect user if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleTabChange = (index) => {
    setIsLogin(index === 0); // 0 = Sign In, 1 = Create Account
    clearError(); // Clear any previous errors when switching tabs
    setInputErrors({}); // Clear input validation errors
    // Clear form fields when switching tabs for better UX
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // Real-time input validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password, isSignup = false) => {
    if (!password) return 'Password is required';
    if (isSignup && password.length < 6) return 'Password must be at least 6 characters';
    if (isSignup && password.length > 128) return 'Password is too long (max 128 characters)';
    if (isSignup && !/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (isSignup && !/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  // Handle input changes with real-time validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear previous error for this field
    if (inputErrors.email) {
      setInputErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Clear previous errors for password fields
    if (inputErrors.password) {
      setInputErrors(prev => ({ ...prev, password: '' }));
    }
    if (inputErrors.confirmPassword && confirmPassword) {
      const confirmError = validateConfirmPassword(value, confirmPassword);
      setInputErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    // Real-time validation for confirm password
    const confirmError = validateConfirmPassword(password, value);
    setInputErrors(prev => ({ ...prev, confirmPassword: confirmError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive input validation
    const errors = {};
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    
    // Validate password
    const passwordError = validatePassword(password, !isLogin);
    if (passwordError) errors.password = passwordError;
    
    // Validate confirm password for signup
    if (!isLogin) {
      const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
      if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    }
    
    // If there are validation errors, show them and stop submission
    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors below and try again',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Clear any previous input errors
    setInputErrors({});

    try {
      setLoading(true);
      clearError();
      
      if (isLogin) {
        await login(email, password);
        toast({
          title: 'Welcome back!',
          description: `Successfully signed in as ${email}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Navigate to home page after successful login
        navigate('/', { replace: true });
      } else {
        await signup(email, password);
        toast({
          title: 'Account created!',
          description: `Welcome to Clove! Your account has been created successfully.`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        // Navigate to home page after successful signup
        navigate('/', { replace: true });
      }
      
      // Clear form on success
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Auth error:', error);
      
      // Enhanced error messages based on Firebase error codes
      let errorMessage = 'An unexpected error occurred. Please try again.';
      let errorTitle = 'Authentication Error';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address. Please check your email or create a new account.';
          errorTitle = 'Account Not Found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again or reset your password.';
          errorTitle = 'Incorrect Password';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists. Please sign in instead or use a different email.';
          errorTitle = 'Email Already Registered';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password with at least 6 characters.';
          errorTitle = 'Weak Password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format. Please check and try again.';
          errorTitle = 'Invalid Email';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support for assistance.';
          errorTitle = 'Account Disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please wait a few minutes before trying again.';
          errorTitle = 'Too Many Attempts';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          errorTitle = 'Connection Error';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid login credentials. Please check your email and password.';
          errorTitle = 'Invalid Credentials';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'This sign-in method is not enabled. Please contact support.';
          errorTitle = 'Sign-in Method Disabled';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Please sign out and sign in again to complete this action.';
          errorTitle = 'Re-authentication Required';
          break;
        default:
          // Check if it's a network error
          if (error.message?.includes('network') || error.message?.includes('fetch')) {
            errorMessage = 'Unable to connect to our servers. Please check your internet connection.';
            errorTitle = 'Connection Error';
          }
          break;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      clearError();
      await loginWithGoogle();
      toast({
        title: 'Success',
        description: 'Welcome to Clove!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Navigate to home page after successful Google login
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Google sign in error:', error);
      
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled. Please try again if you want to continue.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email using a different sign-in method.';
      }
      
      toast({
        title: 'Google Sign-In Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={8}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={6}>
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Tabs 
          width="100%" 
          variant="enclosed" 
          colorScheme="orange"
          onChange={handleTabChange}
          defaultIndex={0}
        >
          <TabList>
            <Tab flex={1}>Sign In</Tab>
            <Tab flex={1}>Create Account</Tab>
          </TabList>

          <TabPanels>
            {/* Sign In Tab */}
            <TabPanel px={0}>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={inputErrors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      bg="white"
                      borderColor={inputErrors.email ? "red.300" : "gray.300"}
                      _hover={{ borderColor: inputErrors.email ? "red.400" : "gray.400" }}
                      _focus={{ borderColor: inputErrors.email ? "red.500" : "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
                    />
                    {inputErrors.email && (
                      <FormErrorMessage>{inputErrors.email}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={inputErrors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                      bg="white"
                      borderColor={inputErrors.password ? "red.300" : "gray.300"}
                      _hover={{ borderColor: inputErrors.password ? "red.400" : "gray.400" }}
                      _focus={{ borderColor: inputErrors.password ? "red.500" : "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
                    />
                    {inputErrors.password && (
                      <FormErrorMessage>{inputErrors.password}</FormErrorMessage>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="orange"
                    size="lg"
                    width="full"
                    isLoading={loading}
                    loadingText="Signing in..."
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </TabPanel>

            {/* Create Account Tab */}
            <TabPanel px={0}>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={inputErrors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      bg="white"
                      borderColor={inputErrors.email ? "red.300" : "gray.300"}
                      _hover={{ borderColor: inputErrors.email ? "red.400" : "gray.400" }}
                      _focus={{ borderColor: inputErrors.email ? "red.500" : "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
                    />
                    {inputErrors.email && (
                      <FormErrorMessage>{inputErrors.email}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={inputErrors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Create a password (min 6 characters)"
                      bg="white"
                      borderColor={inputErrors.password ? "red.300" : "gray.300"}
                      _hover={{ borderColor: inputErrors.password ? "red.400" : "gray.400" }}
                      _focus={{ borderColor: inputErrors.password ? "red.500" : "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
                    />
                    {inputErrors.password && (
                      <FormErrorMessage>{inputErrors.password}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={inputErrors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Confirm your password"
                      bg="white"
                      borderColor={inputErrors.confirmPassword ? "red.300" : "gray.300"}
                      _hover={{ borderColor: inputErrors.confirmPassword ? "red.400" : "gray.400" }}
                      _focus={{ borderColor: inputErrors.confirmPassword ? "red.500" : "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
                    />
                    {inputErrors.confirmPassword && (
                      <FormErrorMessage>{inputErrors.confirmPassword}</FormErrorMessage>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="orange"
                    size="lg"
                    width="full"
                    isLoading={loading}
                    loadingText="Creating account..."
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Divider />

        <Button
          leftIcon={<FaGoogle />}
          variant="outline"
          size="lg"
          width="full"
          onClick={handleGoogleSignIn}
          isLoading={loading}
          loadingText="Signing in..."
          colorScheme="gray"
        >
          Continue with Google
        </Button>
      </VStack>
    </Box>
  );
}
