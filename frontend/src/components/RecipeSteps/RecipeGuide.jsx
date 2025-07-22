// RecipeGuide component displays step-by-step cooking instructions
// Uses framer-motion for smooth transitions between steps
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Progress,
  Text,
  Heading,
  Divider,
  Badge
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight, FaRedo } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeStep from './RecipeStep';

const MotionBox = motion(Box);

export default function RecipeGuide({ recipe }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [viewMode, setViewMode] = useState('guided'); // 'guided' or 'all'

  if (!recipe || !recipe.steps) {
    return null;
  }

  const totalSteps = recipe.steps.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const resetGuide = () => {
    setCurrentStepIndex(0);
  };

  const goToStep = (index) => {
    setCurrentStepIndex(index);
  };

  if (viewMode === 'all') {
    return (
      <Box w="full" maxW="4xl" mx="auto" p={6}>
        <VStack spacing={6}>
          <HStack justify="space-between" w="full">
            <Heading size="lg">All Recipe Steps</Heading>
            <Button 
              variant="outline" 
              onClick={() => setViewMode('guided')}
            >
              Guided Mode
            </Button>
          </HStack>

          <VStack spacing={4} w="full">
            {recipe.steps.map((step, index) => (
              <RecipeStep
                key={index}
                step={step}
                stepNumber={index + 1}
                isActive={false}
              />
            ))}
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="full" maxW="4xl" mx="auto" p={6}>
      <VStack spacing={6}>
        {/* Header */}
        <Box w="full" textAlign="center">
          <HStack justify="space-between" mb={4}>
            <Button 
              variant="outline" 
              onClick={() => setViewMode('all')}
              size="sm"
            >
              View All Steps
            </Button>
            <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
              Step {currentStepIndex + 1} of {totalSteps}
            </Badge>
            <Button 
              variant="outline" 
              leftIcon={<FaRedo />}
              onClick={resetGuide}
              size="sm"
            >
              Start Over
            </Button>
          </HStack>

          <Progress 
            value={progress} 
            colorScheme="blue" 
            size="lg" 
            borderRadius="full"
            bg="gray.200"
          />
          <Text fontSize="sm" color="gray.600" mt={2}>
            {progress.toFixed(0)}% Complete
          </Text>
        </Box>

        <Divider />

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentStepIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            w="full"
          >
            <RecipeStep
              step={recipe.steps[currentStepIndex]}
              stepNumber={currentStepIndex + 1}
              isActive={true}
            />
          </MotionBox>
        </AnimatePresence>

        {/* Navigation */}
        <HStack spacing={4} justify="center" w="full">
          <Button
            leftIcon={<FaArrowLeft />}
            onClick={prevStep}
            isDisabled={currentStepIndex === 0}
            variant="outline"
            size="lg"
          >
            Previous
          </Button>

          <VStack spacing={1}>
            <Text fontSize="sm" color="gray.600">
              Step Progress
            </Text>
            <HStack spacing={1}>
              {recipe.steps.map((_, index) => (
                <Button
                  key={index}
                  size="xs"
                  variant={index === currentStepIndex ? 'solid' : 'outline'}
                  colorScheme={index <= currentStepIndex ? 'blue' : 'gray'}
                  onClick={() => goToStep(index)}
                  w={8}
                >
                  {index + 1}
                </Button>
              ))}
            </HStack>
          </VStack>

          <Button
            rightIcon={<FaArrowRight />}
            onClick={nextStep}
            isDisabled={currentStepIndex === totalSteps - 1}
            colorScheme="blue"
            size="lg"
          >
            {currentStepIndex === totalSteps - 1 ? 'Complete!' : 'Next'}
          </Button>
        </HStack>

        {/* Completion Message */}
        {currentStepIndex === totalSteps - 1 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            p={6}
            bg="green.50"
            borderWidth={1}
            borderColor="green.200"
            borderRadius="lg"
            textAlign="center"
            w="full"
          >
            <Heading size="md" color="green.700" mb={2}>
              Recipe Complete!
            </Heading>
            <Text color="green.600">
              Congratulations! You've finished cooking {recipe.displayName || recipe.recipeName}. 
              Enjoy your delicious meal!
            </Text>
          </MotionBox>
        )}
      </VStack>
    </Box>
  );
}
