import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRecipe } from '../context/RecipeContext';
import RecipeGuide from '../components/RecipeSteps/RecipeGuide';

const MotionBox = motion(Box);

const CookingGuide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRecipe } = useRecipe();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  if (!currentRecipe || currentRecipe.id !== id) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="6xl">
          <VStack spacing={8} align="center" justify="center" minH="60vh">
            <Alert status="warning" maxW="md">
              <AlertIcon />
              Recipe not found. Please go back to the recipe details first.
            </Alert>
            <HStack spacing={4}>
              <Button 
                colorScheme="orange" 
                onClick={() => navigate(`/recipe/${id}`)}
              >
                Go to Recipe Details
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="6xl" py={4}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack justify="space-between" align="center">
              <Button
                variant="ghost"
                colorScheme="orange"
                onClick={() => navigate(`/recipe/${id}`)}
              >
                ← Back to Recipe
              </Button>
              <Heading size="lg" textAlign="center" flex="1">
                Cooking: {currentRecipe.name}
              </Heading>
              <Box w="100px" /> {/* Spacer for centering */}
            </HStack>

            {/* Recipe Guide */}
            <RecipeGuide recipe={currentRecipe} />
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default CookingGuide;
