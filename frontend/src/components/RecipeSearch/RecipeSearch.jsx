// RecipeSearch component with deliberate search flow and suggestion selection
// Shows suggestions on search, lets user select, then generate recipe
import React, { useState, useRef } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  useToast,
  Spinner,
  Tag,
  TagLabel,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { FaSearch, FaUtensils, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../../context/RecipeContext';
import { apiService } from '../../services/api';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionTag = motion(Tag);

export default function RecipeSearch({ onRecipeGenerated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const { generateRecipe, loading, error, clearError } = useRecipe();
  const toast = useToast();
  const navigate = useNavigate();
  const searchInputRef = useRef();

  // Reset everything to original state
  const handleReset = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSuggestionsLoading(false);
    setSelectedRecipe('');
    setSelectedSuggestionIndex(-1);
    clearError();
    
    // Focus back on the input after state is updated
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  // Handle popular suggestion click - set term and search immediately
  const handlePopularSuggestionClick = async (suggestion) => {
    setSearchTerm(suggestion);
    
    // Trigger search immediately with the suggestion
    setSuggestionsLoading(true);
    try {
      clearError();
      const response = await apiService.getRecipeSuggestions(suggestion.trim());
      setSuggestions(response.suggestions || []);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
      setSelectedRecipe(''); // Reset selected recipe
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to get recipe suggestions. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Handle search button click - fetch suggestions
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

    if (searchTerm.trim().length < 3) {
      toast({
        title: 'Error',
        description: 'Please enter at least 3 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSuggestionsLoading(true);
    try {
      clearError();
      const response = await apiService.getRecipeSuggestions(searchTerm.trim());
      setSuggestions(response.suggestions || []);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
      setSelectedRecipe(''); // Reset selected recipe
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to get recipe suggestions. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Handle recipe generation after user selects suggestion
  const handleGenerateRecipe = async () => {
    if (!selectedRecipe) {
      toast({
        title: 'Error',
        description: 'Please select a recipe first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      clearError();
      const recipe = await generateRecipe(selectedRecipe);
      
      // Reset state after successful generation
      setShowSuggestions(false);
      setSuggestions([]);
      setSelectedRecipe('');
      setSearchTerm('');
      
      if (onRecipeGenerated) {
        onRecipeGenerated(recipe);
      } else {
        // Navigate to recipe detail page
        navigate(`/recipe/${recipe.recipeId}`);
      }
      
      toast({
        title: 'Success',
        description: `Recipe for "${selectedRecipe}" generated successfully!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Recipe generation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate recipe',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setSelectedRecipe(suggestion);
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    toast({
      title: 'Recipe Selected',
      description: `"${suggestion}" selected. Click Generate Recipe to continue.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedSuggestionIndex(-1);
    
    // Clear selected recipe if user starts typing again
    if (selectedRecipe && e.target.value !== selectedRecipe) {
      setSelectedRecipe('');
    }
  };

  // Hide suggestions when clicking outside
  const handleInputBlur = () => {
    // Small delay to allow suggestion clicks to register
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 200);
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
            Search for recipes and select from smart suggestions
          </Text>
        </Box>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box w="full">
          <form onSubmit={selectedRecipe ? handleGenerateRecipe : handleSearch}>
            <VStack spacing={4}>
              <InputGroup size="lg">
                <Input
                  ref={searchInputRef}
                  placeholder="e.g., parmedan chicken, pasta, cookies..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onBlur={handleInputBlur}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  pr="4.5rem"
                  fontSize="md"
                  bg="white"
                  border="2px"
                  borderColor={selectedRecipe ? "green.300" : "gray.200"}
                  _hover={{ borderColor: selectedRecipe ? "green.400" : "blue.300" }}
                  _focus={{ 
                    borderColor: selectedRecipe ? "green.500" : "blue.500", 
                    boxShadow: selectedRecipe 
                      ? "0 0 0 1px var(--chakra-colors-green-500)" 
                      : "0 0 0 1px var(--chakra-colors-blue-500)" 
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme={selectedRecipe ? "green" : "blue"}
                    onClick={selectedRecipe ? handleGenerateRecipe : handleSearch}
                    isLoading={loading || suggestionsLoading}
                    loadingText=""
                  >
                    {selectedRecipe ? <FaUtensils /> : <FaSearch />}
                  </Button>
                </InputRightElement>
              </InputGroup>

              {/* Suggestions as Horizontal Bubbles */}
              {showSuggestions && (
                <Box w="full" mt={4}>
                  {suggestionsLoading ? (
                    <HStack spacing={2} justify="center">
                      <Spinner size="sm" />
                      <Text fontSize="sm" color="gray.500">
                        Finding suggestions...
                      </Text>
                    </HStack>
                  ) : suggestions.length > 0 ? (
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="sm" color="gray.600" fontWeight="medium" textAlign="center">
                        Select a recipe:
                      </Text>
                      <Wrap spacing={2}>
                        {suggestions.map((suggestion, index) => (
                          <WrapItem key={index}>
                            <MotionTag
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              size="lg"
                              variant={suggestion === selectedRecipe ? "solid" : "outline"}
                              colorScheme={suggestion === selectedRecipe ? "green" : "blue"}
                              cursor="pointer"
                              _hover={{ 
                                transform: "scale(1.05)",
                                boxShadow: "md"
                              }}
                              onClick={() => handleSuggestionClick(suggestion)}
                              borderWidth={selectedSuggestionIndex === index ? "2px" : "1px"}
                              borderColor={selectedSuggestionIndex === index ? "blue.400" : undefined}
                            >
                              <TagLabel>
                                {suggestion}
                                {suggestion === selectedRecipe && " ✓"}
                              </TagLabel>
                            </MotionTag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </VStack>
                  ) : searchTerm.trim().length >= 3 ? (
                    <Box textAlign="center" py={2}>
                      <Text fontSize="sm" color="gray.500">
                        No suggestions found
                      </Text>
                    </Box>
                  ) : null}
                </Box>
              )}

              {!showSuggestions && (
                <Button
                  type="submit"
                  colorScheme={selectedRecipe ? "green" : "blue"}
                  size="lg"
                  width="full"
                  isLoading={loading || suggestionsLoading}
                  loadingText={selectedRecipe ? "Generating Recipe..." : "Searching..."}
                  leftIcon={selectedRecipe ? <FaUtensils /> : <FaSearch />}
                >
                  {selectedRecipe ? `Generate Recipe: ${selectedRecipe}` : "Search for Recipes"}
                </Button>
              )}

              {/* Cancel Button - Show only when suggestions are visible */}
              {showSuggestions && (
                <Button
                  variant="ghost"
                  size="sm"
                  colorScheme="gray"
                  leftIcon={<FaTimes />}
                  onClick={handleReset}
                  alignSelf="center"
                  mt={2}
                  _hover={{ bg: 'gray.100' }}
                >
                  Cancel
                </Button>
              )}
            </VStack>
          </form>
        </Box>

        {!selectedRecipe && !showSuggestions && (
          <Box w="full">
            <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={3} textAlign="center">
              Popular suggestions:
            </Text>
            <Wrap spacing={2} justify="center">
              {popularSuggestions.map((suggestion, index) => (
                <WrapItem key={index}>
                  <MotionTag
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    size="lg"
                    variant="outline"
                    colorScheme="gray"
                    cursor="pointer"
                    _hover={{ 
                      transform: "scale(1.05)",
                      boxShadow: "md",
                      colorScheme: "blue"
                    }}
                    onClick={() => handlePopularSuggestionClick(suggestion)}
                  >
                    <TagLabel>{suggestion}</TagLabel>
                  </MotionTag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
      </VStack>
    </MotionBox>
  );
}
