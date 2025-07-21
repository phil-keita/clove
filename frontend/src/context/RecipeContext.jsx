// RecipeContext manages recipe state and provides recipe-related functions
// Handles recipe generation, storage, and retrieval
import React, { createContext, useContext, useState } from 'react';
import { apiService } from '../services/api';

const RecipeContext = createContext();

export { RecipeContext };

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
}

export function RecipeProvider({ children }) {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate or get a recipe
  const generateRecipe = async (recipeName) => {
    try {
      setLoading(true);
      setError(null);
      const recipe = await apiService.generateRecipe(recipeName);
      setCurrentRecipe(recipe);
      return recipe;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get recipe by ID
  const getRecipe = async (recipeId) => {
    try {
      setLoading(true);
      setError(null);
      const recipe = await apiService.getRecipeById(recipeId);
      setCurrentRecipe(recipe);
      return recipe;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle like for a recipe
  const toggleLike = async (recipeId) => {
    try {
      const result = await apiService.likeRecipe(recipeId, userId);
      
      // Update current recipe if it's the one being liked
      if (currentRecipe && currentRecipe.recipeId === recipeId) {
        setCurrentRecipe(prev => ({
          ...prev,
          likes: result.likes
        }));
      }
      
      // Refresh liked recipes if needed
      if (result.isLiked) {
        fetchLikedRecipes();
      } else {
        setLikedRecipes(prev => 
          prev.filter(recipe => recipe.recipeId !== recipeId)
        );
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Fetch user's liked recipes
  const fetchLikedRecipes = async () => {
    try {
      const recipes = await apiService.getUserLikedRecipes(userId);
      setLikedRecipes(recipes);
      return recipes;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Fetch popular recipes
  const fetchPopularRecipes = async (limit = 10) => {
    try {
      const recipes = await apiService.getPopularRecipes(limit);
      setPopularRecipes(recipes);
      return recipes;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Clear current recipe
  const clearCurrentRecipe = () => {
    setCurrentRecipe(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    currentRecipe,
    setCurrentRecipe,
    likedRecipes,
    popularRecipes,
    loading,
    error,
    generateRecipe,
    getRecipe,
    toggleLike,
    fetchLikedRecipes,
    fetchPopularRecipes,
    clearCurrentRecipe,
    clearError
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}
