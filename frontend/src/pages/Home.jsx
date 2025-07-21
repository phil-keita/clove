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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useRecipe } from '../context/RecipeContext';
import RecipeSearch from '../components/RecipeSearch/RecipeSearch';
import { apiService } from '../services/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Home = () => {
  const { user } = useContext(AuthContext);
  const { setCurrentRecipe } = useRecipe();
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    loadPopularRecipes();
  }, []);

  const loadPopularRecipes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPopularRecipes();
      setPopularRecipes(response.data || []);
    } catch (error) {
      console.error('Error loading popular recipes:', error);
      setError('Failed to load popular recipes. Backend may not be running.');
      // Set some dummy data for UI testing
      setPopularRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    setCurrentRecipe(recipe);
    navigate(`/recipe/${recipe.recipeId}`);
  };

  const handleStartCooking = (recipe) => {
    setCurrentRecipe(recipe);
    navigate(`/recipe/${recipe.recipeId}/guide`);
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Hero Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            textAlign="center"
            py={8}
          >
            <Heading
              size="2xl"
              bgGradient="linear(to-r, orange.400, pink.400)"
              bgClip="text"
              mb={4}
            >
              Welcome to Clove
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
              Discover amazing recipes, learn cooking techniques, and create delicious meals with step-by-step guides.
            </Text>
          </MotionBox>

          {/* Search Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <RecipeSearch />
          </MotionBox>

          {/* Popular Recipes Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <VStack align="stretch" spacing={6}>
              <HStack justify="space-between" align="center">
                <Heading size="lg">Popular Recipes</Heading>
                <Button
                  variant="outline"
                  colorScheme="orange"
                  onClick={() => navigate('/popular')}
                >
                  View All
                </Button>
              </HStack>

              {loading ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" color="orange.500" />
                  <Text mt={4} color="gray.600">Loading popular recipes...</Text>
                </Box>
              ) : error ? (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              ) : (
                <Grid
                  templateColumns={{
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  }}
                  gap={6}
                >
                  {popularRecipes.slice(0, 6).map((recipe, index) => (
                    <MotionCard
                      key={recipe.recipeId || recipe.id || `recipe-${index}`}
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
                          <VStack align="stretch" spacing={2}>
                            <Heading size="md" noOfLines={2}>
                              {recipe.name}
                            </Heading>
                            <Text color="gray.600" noOfLines={3} fontSize="sm">
                              {recipe.description}
                            </Text>
                            <HStack justify="space-between" align="center">
                              <HStack spacing={2}>
                                <Badge colorScheme="orange">
                                  {recipe.prepTime || '30'} min
                                </Badge>
                                <Badge colorScheme="blue">
                                  {recipe.difficulty || 'Medium'}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.500">
                                ❤️ {recipe.likes || 0}
                              </Text>
                            </HStack>
                          </VStack>
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
                      </CardBody>
                    </MotionCard>
                  ))}
                </Grid>
              )}
            </VStack>
          </MotionBox>

          {/* User Section */}
          {user && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Welcome back, {user.displayName || user.email}!</Heading>
                    <HStack spacing={4}>
                      <Button
                        colorScheme="orange"
                        onClick={() => navigate('/profile')}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        colorScheme="orange"
                        onClick={() => navigate('/liked')}
                      >
                        My Liked Recipes
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </MotionBox>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
