import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  Card,
  CardBody,
  Image,
  Badge,
  Button,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RecipeLike from '../components/RecipeLike/RecipeLike';
import { apiService } from '../services/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const LikedRecipes = () => {
  const { user } = useContext(AuthContext);
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

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleStartCooking = (recipe) => {
    navigate(`/recipe/${recipe.id}/guide`);
  };

  const handleRecipeUnliked = (recipeId) => {
    setLikedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
  };

  if (!user) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="6xl">
          <VStack spacing={8} align="center" justify="center" minH="60vh">
            <Alert status="warning" maxW="md">
              <AlertIcon />
              Please log in to view your liked recipes
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
      <Container maxW="7xl">
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
                onClick={() => navigate('/profile')}
              >
                ← Back to Profile
              </Button>
              <Button
                colorScheme="orange"
                onClick={() => navigate('/')}
              >
                Discover More Recipes
              </Button>
            </HStack>

            <Heading size="2xl" mb={4}>
              My Liked Recipes
            </Heading>
            
            <Text fontSize="lg" color="gray.600">
              Your collection of favorite recipes
            </Text>
          </MotionBox>

          {/* Content */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {loading ? (
              <Box textAlign="center" py={12}>
                <Spinner size="xl" color="orange.500" />
                <Text mt={4} color="gray.600">Loading your liked recipes...</Text>
              </Box>
            ) : error ? (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            ) : likedRecipes.length === 0 ? (
              <Card bg={cardBg}>
                <CardBody textAlign="center" py={12}>
                  <VStack spacing={4}>
                    <Text fontSize="xl" color="gray.600">
                      You haven't liked any recipes yet! 💔
                    </Text>
                    <Text color="gray.500">
                      Start exploring and save your favorite recipes by clicking the heart icon.
                    </Text>
                    <Button
                      colorScheme="orange"
                      size="lg"
                      onClick={() => navigate('/')}
                    >
                      Discover Recipes
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between" align="center">
                  <Text color="gray.600">
                    {likedRecipes.length} recipe{likedRecipes.length !== 1 ? 's' : ''} found
                  </Text>
                </HStack>

                <Grid
                  templateColumns={{
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                    xl: 'repeat(4, 1fr)',
                  }}
                  gap={6}
                >
                  {likedRecipes.map((recipe, index) => (
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
                        <VStack align="stretch" spacing={4}>
                          {recipe.image && (
                            <Image
                              src={recipe.image}
                              alt={recipe.name}
                              borderRadius="md"
                              h="200px"
                              objectFit="cover"
                            />
                          )}
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between" align="flex-start">
                              <Heading size="md" noOfLines={2} flex="1">
                                {recipe.name}
                              </Heading>
                              <Box onClick={(e) => e.stopPropagation()}>
                                <RecipeLike 
                                  recipeId={recipe.id}
                                  onUnlike={() => handleRecipeUnliked(recipe.id)}
                                />
                              </Box>
                            </HStack>
                            
                            <Text color="gray.600" noOfLines={3} fontSize="sm">
                              {recipe.description}
                            </Text>
                            
                            <Wrap spacing={2}>
                              <WrapItem>
                                <Badge colorScheme="orange">
                                  {recipe.prepTime || '30'} min
                                </Badge>
                              </WrapItem>
                              <WrapItem>
                                <Badge colorScheme="blue">
                                  {recipe.difficulty || 'Medium'}
                                </Badge>
                              </WrapItem>
                              <WrapItem>
                                <Badge colorScheme="green">
                                  ❤️ {recipe.likes || 0}
                                </Badge>
                              </WrapItem>
                            </Wrap>
                            
                            <Button
                              colorScheme="orange"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartCooking(recipe);
                              }}
                            >
                              Start Cooking
                            </Button>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </MotionCard>
                  ))}
                </Grid>
              </VStack>
            )}
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default LikedRecipes;
