import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  Image,
  Badge,
  Button,
  Divider,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, TimeIcon } from '@chakra-ui/icons';
import { FaUsers } from 'react-icons/fa';
import YouTube from 'react-youtube';
import { AuthContext } from '../context/AuthContext';
import { useRecipe } from '../context/RecipeContext';
import RecipeLike from '../components/RecipeLike/RecipeLike';
import YouTubeRegularVideosOnly from '../components/YouTubeVideos/YouTubeRegularVideosOnly';
import YouTubeShortsOnly from '../components/YouTubeVideos/YouTubeShortsOnly';
import { apiService } from '../services/api';

const MotionBox = motion(Box);

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { currentRecipe, setCurrentRecipe, getRecipe } = useRecipe();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [enhancedRecipe, setEnhancedRecipe] = useState(null);
  const [activeVideoEnhancement, setActiveVideoEnhancement] = useState(null);
  const [videoEnhancementLoading, setVideoEnhancementLoading] = useState(null);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (id) {
      loadRecipe();
    }
  }, [id]);

  useEffect(() => {
    if (currentRecipe && currentRecipe.recipeId === id) {
      setRecipe(currentRecipe);
      setLoading(false);
      extractVideoId();
    }
  }, [currentRecipe, id]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if we have the recipe in context
      if (currentRecipe && currentRecipe.recipeId === id) {
        setRecipe(currentRecipe);
        extractVideoId();
      } else {
        // Try to fetch recipe from backend using context
        try {
          const fetchedRecipe = await getRecipe(id);
          setRecipe(fetchedRecipe);
          extractVideoId();
        } catch (fetchError) {
          console.error('Error fetching recipe:', fetchError);
          setError('Recipe not found. Please search for a recipe first.');
        }
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = () => {
    const currentRecipeData = recipe || currentRecipe;
    if (currentRecipeData?.youtubeUrl) {
      // Extract video ID from YouTube URL if it's a watch URL
      const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      const match = currentRecipeData.youtubeUrl.match(regex);
      if (match) {
        setVideoId(match[1]);
      }
    }
  };

  const handleStartCooking = () => {
    setCurrentRecipe(recipe);
    navigate(`/recipe/${id}/guide`);
  };

  const handleBackToSearch = () => {
    navigate('/');
  };

  const handleUseVideoTutorial = async (video) => {
    if (activeVideoEnhancement === video.videoId) {
      return; // Already applied
    }

    try {
      setVideoEnhancementLoading(video.videoId);
      setActiveVideoEnhancement(null);
      setEnhancedRecipe(null);

      console.log('Analyzing video tutorial:', video);
      
      const analysisResponse = await apiService.analyzeVideoTutorial(recipe.recipeId || id, video.videoId);
      console.log('Video analysis response:', analysisResponse);

      if (analysisResponse.enhancedRecipe) {
        setEnhancedRecipe(analysisResponse.enhancedRecipe);
        setActiveVideoEnhancement(video.videoId);
      }
    } catch (error) {
      console.error('Error analyzing video tutorial:', error);
      // Could add error notification here
    } finally {
      setVideoEnhancementLoading(null);
    }
  };

  const handleCancelVideoEnhancement = () => {
    setEnhancedRecipe(null);
    setActiveVideoEnhancement(null);
    setVideoEnhancementLoading(null);
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="6xl">
          <VStack spacing={8} align="center" justify="center" minH="60vh">
            <Spinner size="xl" color="orange.500" />
            <Text>Loading recipe...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error || !recipe) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="6xl">
          <VStack spacing={8} align="center" justify="center" minH="60vh">
            <Alert status="error" maxW="md">
              <AlertIcon />
              {error || 'Recipe not found'}
            </Alert>
            <Button colorScheme="orange" onClick={handleBackToSearch}>
              Back to Search
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
                onClick={handleBackToSearch}
              >
                ← Back to Search
              </Button>
              {user && <RecipeLike recipeId={recipe.id} />}
            </HStack>

            <Heading size="2xl" mb={4}>
              {recipe.name}
            </Heading>
            
            <Text fontSize="lg" color="gray.600" mb={6}>
              {recipe.description}
            </Text>

            <Wrap spacing={4}>
              <WrapItem>
                <HStack>
                  <TimeIcon color="orange.500" />
                  <Text fontWeight="semibold">
                    {recipe.prepTime || '30'} minutes
                  </Text>
                </HStack>
              </WrapItem>
              <WrapItem>
                <HStack>
                  <FaUsers color="orange.500" />
                  <Text fontWeight="semibold">
                    Serves {recipe.servings || '4'}
                  </Text>
                </HStack>
              </WrapItem>
              <WrapItem>
                <Badge colorScheme="orange" fontSize="sm" px={3} py={1}>
                  {recipe.difficulty || 'Medium'}
                </Badge>
              </WrapItem>
            </Wrap>
          </MotionBox>

          {/* Video Enhancement Notification */}
          {activeVideoEnhancement && (
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box bg="orange.50" p={4} borderRadius="md" border="1px solid" borderColor="orange.200">
                <VStack spacing={3}>
                  <Text fontSize="sm" color="orange.700" textAlign="center">
                    📹 Recipe enhanced with video tutorial insights! Enhanced steps and ingredients are highlighted below.
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    onClick={handleCancelVideoEnhancement}
                  >
                    Cancel Enhancement
                  </Button>
                </VStack>
              </Box>
            </MotionBox>
          )}

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            {/* Main Content */}
            <GridItem>
              <VStack spacing={8} align="stretch">
                {/* Recipe Image */}
                {recipe.image && (
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Image
                      src={recipe.image}
                      alt={recipe.name}
                      borderRadius="lg"
                      w="100%"
                      h="400px"
                      objectFit="cover"
                    />
                  </MotionBox>
                )}

                {/* Video */}
                {videoId && (
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={4}>
                          Watch & Learn
                        </Heading>
                        <Box borderRadius="md" overflow="hidden">
                          <YouTube
                            videoId={videoId}
                            opts={{
                              width: '100%',
                              height: '315',
                              playerVars: {
                                autoplay: 0,
                              },
                            }}
                          />
                        </Box>
                      </CardBody>
                    </Card>
                  </MotionBox>
                )}

                {/* Instructions */}
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card bg={cardBg}>
                    <CardBody>
                      <Heading size="md" mb={4}>
                        Instructions
                      </Heading>
                      <List spacing={4}>
                        {(enhancedRecipe || recipe).steps?.map((step, index) => (
                          <ListItem key={index}>
                            <HStack align="flex-start" spacing={4}>
                              <Badge
                                colorScheme="orange"
                                borderRadius="full"
                                minW="24px"
                                h="24px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                              >
                                {index + 1}
                              </Badge>
                              <Box flex="1">
                                <Text 
                                  fontSize="sm" 
                                  lineHeight="1.5"
                                  color={step.isVideoEnhanced ? "green.700" : "gray.700"}
                                  fontWeight={step.isVideoEnhanced ? "semibold" : "normal"}
                                  bg={step.isVideoEnhanced ? "green.50" : "transparent"}
                                  px={step.isVideoEnhanced ? 3 : 0}
                                  py={step.isVideoEnhanced ? 2 : 0}
                                  borderRadius={step.isVideoEnhanced ? "md" : "none"}
                                  border={step.isVideoEnhanced ? "1px solid" : "none"}
                                  borderColor={step.isVideoEnhanced ? "green.200" : "transparent"}
                                >
                                  {step.description}
                                  {step.isVideoEnhanced && (
                                    <Badge ml={2} colorScheme="green" size="sm">
                                      From Video
                                    </Badge>
                                  )}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                  </Card>
                </MotionBox>
              </VStack>
            </GridItem>

            {/* Sidebar */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Start Cooking Button */}
                <MotionBox
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Button
                    colorScheme="orange"
                    size="lg"
                    w="100%"
                    onClick={handleStartCooking}
                  >
                    🍳 Start Cooking
                  </Button>
                </MotionBox>

                {/* Ingredients */}
                <MotionBox
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card bg={cardBg}>
                    <CardBody>
                      <Heading size="md" mb={4}>
                        Ingredients
                      </Heading>
                      <List spacing={2}>
                        {(enhancedRecipe || recipe).ingredients?.map((ingredient, index) => (
                          <ListItem key={index}>
                            <HStack>
                              <ListIcon as={CheckCircleIcon} color="green.500" />
                              <Text 
                                fontSize="sm"
                                color={ingredient.isVideoEnhanced ? "blue.600" : "gray.700"}
                                fontWeight={ingredient.isVideoEnhanced ? "semibold" : "normal"}
                                bg={ingredient.isVideoEnhanced ? "blue.50" : "transparent"}
                                px={ingredient.isVideoEnhanced ? 2 : 0}
                                py={ingredient.isVideoEnhanced ? 1 : 0}
                                borderRadius={ingredient.isVideoEnhanced ? "md" : "none"}
                              >
                                {`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                                {ingredient.isVideoEnhanced && (
                                  <Badge ml={2} colorScheme="blue" size="sm">
                                    From Video
                                  </Badge>
                                )}
                              </Text>
                            </HStack>
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                  </Card>
                </MotionBox>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <MotionBox
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={4}>
                          Tags
                        </Heading>
                        <Wrap spacing={2}>
                          {recipe.tags.map((tag, index) => (
                            <WrapItem key={index}>
                              <Tag size="sm" colorScheme="orange">
                                <TagLabel>{tag}</TagLabel>
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </CardBody>
                    </Card>
                  </MotionBox>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default RecipeDetail;
