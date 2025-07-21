// SignUp and Login use Firebase Auth functions.
// On auth state change, save user to context/global state.
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Divider,
  useToast
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function AuthForm({ isLogin, onToggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle, error, clearError } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      clearError();
      
      if (isLogin) {
        await login(email, password);
        toast({
          title: 'Success',
          description: 'Welcome back!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await signup(email, password);
        toast({
          title: 'Success',
          description: 'Account created successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
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
        description: 'Welcome!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Google sign in error:', error);
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
      <VStack spacing={4}>
        <Heading size="lg" textAlign="center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Heading>
        
        <Text color="gray.600" textAlign="center">
          {isLogin 
            ? 'Sign in to save your favorite recipes' 
            : 'Join us to start your cooking journey'
          }
        </Text>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={loading}
              loadingText={isLogin ? 'Signing in...' : 'Creating account...'}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </VStack>
        </form>

        <Divider />

        <Button
          leftIcon={<FaGoogle />}
          variant="outline"
          size="lg"
          width="full"
          onClick={handleGoogleSignIn}
          isLoading={loading}
          loadingText="Signing in..."
        >
          Continue with Google
        </Button>

        <Text color="gray.600" textAlign="center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Button
            variant="link"
            colorScheme="blue"
            onClick={onToggle}
            size="sm"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </Button>
        </Text>
      </VStack>
    </Box>
  );
}
