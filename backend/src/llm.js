// This module handles all OpenAI GPT-3.5 Turbo interactions for recipe generation
// Provides functionality to generate recipes with structured JSON output
const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a recipe using OpenAI GPT-3.5 Turbo
 * @param {string} recipeName - Name of the recipe to generate
 * @returns {Promise<Object>} - Structured recipe data
 */
async function generateRecipe(recipeName) {
  try {
    const prompt = `Return the recipe for "${recipeName}" with these fields in JSON format:
- ingredients (array of { name, quantity, unit })
- steps (array of { description, timeMinutes (optional for cooking/waiting steps) })
- difficulty (string: "Easy", "Medium", or "Hard")
- estimatedTime (total time in minutes)
- servings (number of servings)

Highlight steps with 'timeMinutes' for cooking/waiting steps like baking, simmering, etc.

Example format:
{
  "ingredients": [
    {"name": "flour", "quantity": "2", "unit": "cups"},
    {"name": "eggs", "quantity": "3", "unit": "pieces"}
  ],
  "steps": [
    {"description": "Preheat oven to 350°F", "timeMinutes": 10},
    {"description": "Mix flour and eggs in a bowl"},
    {"description": "Bake for 25 minutes", "timeMinutes": 25}
  ],
  "difficulty": "Easy",
  "estimatedTime": 45,
  "servings": 4
}

Return only valid JSON, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef assistant that creates detailed, accurate recipes in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Parse the JSON response
    let recipe;
    try {
      recipe = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', responseText);
      throw new Error('OpenAI returned invalid JSON format');
    }
    
    // Validate required fields
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      throw new Error('Invalid or missing ingredients in recipe');
    }
    
    if (!recipe.steps || !Array.isArray(recipe.steps) || recipe.steps.length === 0) {
      throw new Error('Invalid or missing steps in recipe');
    }
    
    if (!recipe.difficulty || typeof recipe.difficulty !== 'string') {
      throw new Error('Invalid or missing difficulty in recipe');
    }
    
    if (!recipe.estimatedTime || typeof recipe.estimatedTime !== 'number') {
      throw new Error('Invalid or missing estimated time in recipe');
    }

    // Validate ingredient structure
    for (const ingredient of recipe.ingredients) {
      if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
        throw new Error('Invalid ingredient structure - missing name, quantity, or unit');
      }
    }

    // Validate step structure
    for (const step of recipe.steps) {
      if (!step.description || typeof step.description !== 'string') {
        throw new Error('Invalid step structure - missing or invalid description');
      }
    }

    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    
    // Return a fallback recipe structure if OpenAI fails
    return {
      ingredients: [
        { name: "OpenAI service error", quantity: "1", unit: "error" }
      ],
      steps: [
        { description: "There was an error generating the recipe. Please try again later." }
      ],
      difficulty: "Unknown",
      estimatedTime: 0,
      servings: 1,
      error: error.message
    };
  }
}

/**
 * Search for YouTube videos related to the recipe
 * @param {string} recipeName - Name of the recipe
 * @returns {string} - YouTube search URL
 */
function getYouTubeSearchUrl(recipeName) {
  const searchQuery = encodeURIComponent(`${recipeName} recipe cooking tutorial`);
  return `https://www.youtube.com/results?search_query=${searchQuery}`;
}

module.exports = {
  generateRecipe,
  getYouTubeSearchUrl
};
