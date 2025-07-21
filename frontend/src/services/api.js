// API service for making HTTP requests to the backend
// Handles all communication with the Express.js API server
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('authToken');
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Generate or get a recipe
  generateRecipe: async (recipeName) => {
    try {
      const response = await api.post('/api/recipe/generate', { recipeName });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate recipe');
    }
  },

  // Get recipe by ID
  getRecipeById: async (recipeId) => {
    try {
      const response = await api.get(`/api/recipe/${recipeId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get recipe');
    }
  },

  // Get popular recipes
  getPopularRecipes: async () => {
    try {
      const response = await api.get('/api/recipes/popular');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get popular recipes');
    }
  },

  // Get user's liked recipes
  getUserLikedRecipes: async (userId) => {
    try {
      const response = await api.get('/api/user/liked-recipes');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get liked recipes');
    }
  },

  // Like a recipe
  likeRecipe: async (recipeId, userId) => {
    try {
      const response = await api.post('/api/recipe/like', { recipeId, userId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to like recipe');
    }
  },

  // Unlike a recipe
  unlikeRecipe: async (recipeId, userId) => {
    try {
      const response = await api.delete('/api/recipe/like', { 
        data: { recipeId, userId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to unlike recipe');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error('API health check failed');
    }
  }
};

// Keep the old export for backward compatibility
export const recipeService = apiService;
