import React, { useState, useEffect } from 'react';
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
import { apiService } from '../services/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const PopularRecipes = () => {
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
      setPopularRecipes(response.data);
    } catch (error) {
      console.error('Error loading popular recipes:', error);
      setError('Failed to load popular recipes');
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
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </Button>
              <Button
                colorScheme="orange"
                onClick={() => navigate('/')}
              >
                Search Recipes
              </Button>
            </HStack>

            <Heading size="2xl" mb={4}>
              Popular Recipes
            </Heading>
            
            <Text fontSize="lg" color="gray.600">
              Discover the most loved recipes by our community
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
                <Text mt={4} color="gray.600">Loading popular recipes...</Text>
              </Box>
            ) : error ? (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            ) : popularRecipes.length === 0 ? (
              <Card bg={cardBg}>
                <CardBody textAlign="center" py={12}>
                  <VStack spacing={4}>
                    <Text fontSize="xl" color="gray.600">
                      No popular recipes found
                    </Text>
                    <Text color="gray.500">
                      Be the first to search and like some recipes!
                    </Text>
                    <Button
                      colorScheme="orange"
                      size="lg"
                      onClick={() => navigate('/')}
                    >
                      Search Recipes
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between" align="center">
                  <Text color="gray.600">
                    {popularRecipes.length} popular recipe{popularRecipes.length !== 1 ? 's' : ''} found
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
                  {popularRecipes.map((recipe, index) => (
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
                      position="relative"
                    >
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          {/* Ranking Badge */}
                          {index < 3 && (
                            <Badge
                              position="absolute"
                              top={2}
                              right={2}
                              colorScheme={index === 0 ? 'yellow' : index === 1 ? 'gray' : 'orange'}
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="full"
                              zIndex={1}
                            >
                              #{index + 1}
                            </Badge>
                          )}

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
                            <Heading size="md" noOfLines={2}>
                              {recipe.name}
                            </Heading>
                            
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
                                <Badge colorScheme="red" variant="subtle">
                                  {recipe.likes || 0} likes
                                </Badge>
                              </WrapItem>
                            </Wrap>
                            
                            <HStack spacing={2}>
                              <Button
                                colorScheme="orange"
                                size="sm"
                                flex="1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartCooking(recipe);
                                }}
                              >
                                Cook Now
                              </Button>
                              <Button
                                variant="outline"
                                colorScheme="orange"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRecipeClick(recipe);
                                }}
                              >
                                View
                              </Button>
                            </HStack>
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

export default PopularRecipes;
