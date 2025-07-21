// RecipeLike component handles liking/unliking recipes
// Shows like count and allows authenticated users to like recipes
import React, { useState, useEffect } from 'react';
import {
  Button,
  HStack,
  Text,
  useToast
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useRecipe } from '../../context/RecipeContext';

export default function RecipeLike({ recipe }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(recipe?.likes || 0);
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const { toggleLike } = useRecipe();
  const toast = useToast();

  useEffect(() => {
    if (recipe) {
      setLikes(recipe.likes || 0);
    }
  }, [recipe]);

  useEffect(() => {
    // Check if current user has liked this recipe
    // This would typically come from the API or be tracked in the context
    // For now, we'll use localStorage as a simple solution
    if (currentUser && recipe?.recipeId) {
      const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
      setIsLiked(likedRecipes.includes(recipe.recipeId));
    }
  }, [currentUser, recipe?.recipeId]);

  const handleToggleLike = async () => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like recipes',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!recipe?.recipeId) {
      toast({
        title: 'Error',
        description: 'Recipe not found',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const result = await toggleLike(recipe.recipeId);
      
      setIsLiked(result.isLiked);
      setLikes(result.likes);

      // Update localStorage
      const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
      if (result.isLiked) {
        if (!likedRecipes.includes(recipe.recipeId)) {
          likedRecipes.push(recipe.recipeId);
        }
      } else {
        const index = likedRecipes.indexOf(recipe.recipeId);
        if (index > -1) {
          likedRecipes.splice(index, 1);
        }
      }
      localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));

      toast({
        title: result.isLiked ? 'Recipe Liked!' : 'Recipe Unliked',
        description: result.message,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update like status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!recipe) {
    return null;
  }

  return (
    <HStack spacing={3}>
      <Button
        leftIcon={isLiked ? <FaHeart /> : <FaRegHeart />}
        colorScheme={isLiked ? 'red' : 'gray'}
        variant={isLiked ? 'solid' : 'outline'}
        size="md"
        onClick={handleToggleLike}
        isLoading={loading}
        loadingText="..."
      >
        {isLiked ? 'Liked' : 'Like'}
      </Button>
      
      <HStack spacing={1}>
        <FaHeart color="#E53E3E" />
        <Text fontWeight="medium" color="gray.700">
          {likes.toLocaleString()}
        </Text>
        <Text color="gray.500" fontSize="sm">
          {likes === 1 ? 'like' : 'likes'}
        </Text>
      </HStack>
    </HStack>
  );
}
