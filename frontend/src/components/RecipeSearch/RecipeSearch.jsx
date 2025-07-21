// RecipeSearch component allows users to search for recipes
// Sends requests to backend API and displays results
import React, { useState, useContext } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  useToast
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../../context/RecipeContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function RecipeSearch({ onRecipeGenerated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { generateRecipe, loading, error, clearError, setCurrentRecipe } = useRecipe();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a recipe name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      clearError();
      const recipe = await generateRecipe(searchTerm.trim());
      
      if (onRecipeGenerated) {
        onRecipeGenerated(recipe);
      } else {
        // Navigate to recipe detail page
        navigate(`/recipe/${recipe.recipeId}`);
      }
      
      toast({
        title: 'Success',
        description: `Recipe for "${searchTerm}" generated successfully!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate recipe',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const popularSuggestions = [
    'Spaghetti Bolognese',
    'Chicken Tikka Masala',
    'Chocolate Chip Cookies',
    'Caesar Salad',
    'Beef Tacos',
    'Margherita Pizza'
  ];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      w="full"
      maxW="2xl"
      mx="auto"
      p={6}
    >
      <VStack spacing={6}>
        <Box textAlign="center">
          <Heading size="xl" mb={2} color="gray.800">
            What would you like to cook?
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Enter any recipe name and we'll generate step-by-step instructions for you
          </Text>
        </Box>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSearch} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <InputGroup size="lg">
              <Input
                placeholder="e.g., Chicken Parmesan, Chocolate Cake, Pasta Carbonara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                pr="4.5rem"
                fontSize="md"
                bg="white"
                border="2px"
                borderColor="gray.200"
                _hover={{ borderColor: 'blue.300' }}
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  colorScheme="blue"
                  onClick={handleSearch}
                  isLoading={loading}
                  loadingText=""
                >
                  <FaSearch />
                </Button>
              </InputRightElement>
            </InputGroup>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={loading}
              loadingText="Generating Recipe..."
              leftIcon={<FaSearch />}
            >
              Generate Recipe
            </Button>
          </VStack>
        </form>

        <Box w="full">
          <Text fontSize="sm" color="gray.500" mb={3} textAlign="center">
            Popular suggestions:
          </Text>
          <VStack spacing={2}>
            {popularSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm(suggestion)}
                _hover={{ bg: 'gray.100' }}
                width="full"
                justifyContent="flex-start"
              >
                {suggestion}
              </Button>
            ))}
          </VStack>
        </Box>
      </VStack>
    </MotionBox>
  );
}
