import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  Avatar,
  Button,
  Grid,
  GridItem,
  Badge,
  Divider,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (user) {
      loadLikedRecipes();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const loadLikedRecipes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserLikedRecipes(user.uid);
      setLikedRecipes(response.data);
    } catch (error) {
      console.error('Error loading liked recipes:', error);
      setError('Failed to load liked recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  if (!user) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="6xl">
          <VStack spacing={8} align="center" justify="center" minH="60vh">
            <Alert status="warning" maxW="md">
              <AlertIcon />
              Please log in to view your profile
            </Alert>
            <Button colorScheme="orange" onClick={() => navigate('/auth')}>
              Go to Login
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HStack justify="space-between" align="center" mb={6}>
              <Button
                variant="ghost"
                colorScheme="orange"
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </HStack>
          </MotionBox>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={8}>
            {/* Profile Info */}
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card bg={cardBg}>
                  <CardBody>
                    <VStack spacing={6} align="center">
                      <Avatar
                        size="2xl"
                        src={user.photoURL}
                        name={user.displayName || user.email}
                      />
                      <VStack spacing={2} textAlign="center">
                        <Heading size="lg">
                          {user.displayName || 'Recipe Explorer'}
                        </Heading>
                        <Text color="gray.600">{user.email}</Text>
                        <Badge colorScheme="orange" px={3} py={1}>
                          Home Chef
                        </Badge>
                      </VStack>

                      <Divider />

                      <VStack spacing={4} w="100%">
                        <HStack justify="space-between" w="100%">
                          <Text fontWeight="semibold">Joined:</Text>
                          <Text color="gray.600">
                            {user.metadata.creationTime 
                              ? new Date(user.metadata.creationTime).toLocaleDateString()
                              : 'Recently'
                            }
                          </Text>
                        </HStack>
                        <HStack justify="space-between" w="100%">
                          <Text fontWeight="semibold">Liked Recipes:</Text>
                          <Badge colorScheme="green">
                            {likedRecipes.length}
                          </Badge>
                        </HStack>
                      </VStack>

                      <Button
                        colorScheme="orange"
                        w="100%"
                        onClick={() => navigate('/liked')}
                      >
                        View All Liked Recipes
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            </GridItem>

            {/* Recent Liked Recipes */}
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <VStack align="stretch" spacing={6}>
                  <Heading size="lg">Recent Liked Recipes</Heading>

                  {loading ? (
                    <Box textAlign="center" py={8}>
                      <Spinner size="lg" color="orange.500" />
                      <Text mt={4} color="gray.600">Loading your recipes...</Text>
                    </Box>
                  ) : error ? (
                    <Alert status="error">
                      <AlertIcon />
                      {error}
                    </Alert>
                  ) : likedRecipes.length === 0 ? (
                    <Card bg={cardBg}>
                      <CardBody textAlign="center" py={8}>
                        <Text color="gray.600" mb={4}>
                          You haven't liked any recipes yet!
                        </Text>
                        <Button
                          colorScheme="orange"
                          onClick={() => navigate('/')}
                        >
                          Discover Recipes
                        </Button>
                      </CardBody>
                    </Card>
                  ) : (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      {likedRecipes.slice(0, 4).map((recipe, index) => (
                        <MotionCard
                          key={recipe.id}
                          bg={cardBg}
                          cursor="pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRecipeClick(recipe)}
                        >
                          <CardBody>
                            <VStack align="stretch" spacing={3}>
                              {recipe.image && (
                                <Image
                                  src={recipe.image}
                                  alt={recipe.name}
                                  borderRadius="md"
                                  h="120px"
                                  objectFit="cover"
                                />
                              )}
                              <VStack align="stretch" spacing={2}>
                                <Heading size="sm" noOfLines={2}>
                                  {recipe.name}
                                </Heading>
                                <Text color="gray.600" noOfLines={2} fontSize="xs">
                                  {recipe.description}
                                </Text>
                                <Wrap spacing={1}>
                                  <WrapItem>
                                    <Badge colorScheme="orange" size="sm">
                                      {recipe.prepTime || '30'} min
                                    </Badge>
                                  </WrapItem>
                                  <WrapItem>
                                    <Badge colorScheme="blue" size="sm">
                                      {recipe.difficulty || 'Medium'}
                                    </Badge>
                                  </WrapItem>
                                </Wrap>
                              </VStack>
                            </VStack>
                          </CardBody>
                        </MotionCard>
                      ))}
                    </Grid>
                  )}

                  {likedRecipes.length > 4 && (
                    <Button
                      variant="outline"
                      colorScheme="orange"
                      onClick={() => navigate('/liked')}
                    >
                      View All {likedRecipes.length} Liked Recipes
                    </Button>
                  )}
                </VStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Profile;
