// Utility functions for caching, data validation, and helper operations
const crypto = require('crypto');

/**
 * Generate a unique recipe ID based on recipe name
 * @param {string} recipeName - Name of the recipe
 * @returns {string} - Unique recipe ID
 */
function generateRecipeId(recipeName) {
  return crypto
    .createHash('md5')
    .update(recipeName.toLowerCase().trim())
    .digest('hex');
}

/**
 * Validate recipe data structure
 * @param {Object} recipe - Recipe object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateRecipeData(recipe) {
  if (!recipe || typeof recipe !== 'object') return false;
  
  const requiredFields = ['ingredients', 'steps', 'difficulty', 'estimatedTime'];
  
  for (const field of requiredFields) {
    if (!(field in recipe)) return false;
  }
  
  // Validate ingredients array
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    return false;
  }
  
  // Validate steps array
  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    return false;
  }
  
  // Validate each ingredient has required fields
  for (const ingredient of recipe.ingredients) {
    if (!ingredient.name || !ingredient.quantity) {
      return false;
    }
  }
  
  // Validate each step has description
  for (const step of recipe.steps) {
    if (!step.description) {
      return false;
    }
  }
  
  return true;
}

/**
 * Format recipe data for consistent storage and retrieval
 * @param {Object} recipe - Raw recipe data
 * @param {string} recipeName - Name of the recipe
 * @param {string} recipeId - Unique recipe ID
 * @returns {Object} - Formatted recipe data
 */
function formatRecipeForStorage(recipe, recipeName, recipeId) {
  return {
    recipeId,
    recipeName: recipeName.toLowerCase().trim(),
    displayName: recipeName,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    difficulty: recipe.difficulty,
    estimatedTime: recipe.estimatedTime,
    servings: recipe.servings || 4,
    likes: 0,
    createdAt: new Date(),
    lastSearched: new Date(),
    searchCount: 1
  };
}

/**
 * Clean and normalize recipe name for consistent searching
 * @param {string} recipeName - Raw recipe name from user input
 * @returns {string} - Cleaned recipe name
 */
function normalizeRecipeName(recipeName) {
  if (!recipeName || typeof recipeName !== 'string') {
    return '';
  }
  
  return recipeName
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Check if a recipe is considered "fresh" based on last update
 * @param {Date} lastSearched - When the recipe was last searched
 * @param {number} maxAgeHours - Maximum age in hours (default: 24)
 * @returns {boolean} - True if recipe is fresh, false if stale
 */
function isRecipeFresh(lastSearched, maxAgeHours = 24) {
  if (!lastSearched) return false;
  
  const now = new Date();
  const ageInHours = (now - new Date(lastSearched)) / (1000 * 60 * 60);
  
  return ageInHours < maxAgeHours;
}

/**
 * Calculate total time including prep and cooking steps
 * @param {Array} steps - Array of recipe steps
 * @returns {number} - Total active cooking time in minutes
 */
function calculateActiveCookingTime(steps) {
  if (!Array.isArray(steps)) return 0;
  
  return steps.reduce((total, step) => {
    return total + (step.timeMinutes || 0);
  }, 0);
}

module.exports = {
  generateRecipeId,
  validateRecipeData,
  formatRecipeForStorage,
  normalizeRecipeName,
  isRecipeFresh,
  calculateActiveCookingTime
};
