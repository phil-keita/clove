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

    // Validate ingredient structure - more flexible validation
    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ingredient = recipe.ingredients[i];
      
      // If ingredient is a string, try to parse it
      if (typeof ingredient === 'string') {
        // Try to parse "2 cups flour" format
        const parts = ingredient.trim().split(' ');
        if (parts.length >= 3) {
          recipe.ingredients[i] = {
            quantity: parts[0],
            unit: parts[1],
            name: parts.slice(2).join(' ')
          };
        } else {
          // Set default values for missing parts
          recipe.ingredients[i] = {
            name: ingredient,
            quantity: "1",
            unit: "piece"
          };
        }
      } else if (typeof ingredient === 'object') {
        // Ensure all required fields exist, set defaults if missing
        if (!ingredient.name) ingredient.name = "Unknown ingredient";
        if (!ingredient.quantity) ingredient.quantity = "1";
        if (!ingredient.unit) ingredient.unit = "piece";
      } else {
        throw new Error(`Invalid ingredient format at index ${i}`);
      }
    }

    // Validate step structure - more flexible validation
    for (let i = 0; i < recipe.steps.length; i++) {
      const step = recipe.steps[i];
      
      // If step is a string, convert it to object format
      if (typeof step === 'string') {
        recipe.steps[i] = {
          description: step
        };
      } else if (typeof step === 'object') {
        // Ensure description exists
        if (!step.description || typeof step.description !== 'string') {
          throw new Error(`Invalid step structure at index ${i} - missing or invalid description`);
        }
      } else {
        throw new Error(`Invalid step format at index ${i}`);
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
 * Generate recipe suggestions based on user input with typo correction
 * @param {string} query - User's search query
 * @returns {Promise<Array<string>>} - Array of up to 5 recipe suggestions
 */
async function generateRecipeSuggestions(query) {
  try {
    const prompt = `Based on the user's search query "${query}", provide up to 5 recipe title suggestions that are most likely what they're looking for.

Rules:
- Correct any obvious typos or misspellings
- If the query is very general (like "chicken"), suggest popular variations
- Return realistic, popular recipe names
- Prioritize common and well-known recipes
- Return only the recipe titles, nothing else
- Return as a JSON array of strings

Examples:
Query: "parmedan chicken" → ["Parmesan Chicken", "Chicken Parmesan", "Baked Parmesan Chicken", "Crispy Parmesan Chicken", "Parmesan Crusted Chicken"]
Query: "chicken" → ["Grilled Chicken", "Chicken Stir Fry", "Chicken Curry", "Fried Chicken", "Chicken Soup"]
Query: "pasta" → ["Spaghetti Carbonara", "Chicken Alfredo Pasta", "Penne Arrabbiata", "Lasagna", "Mac and Cheese"]

Return only a JSON array of strings, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful cooking assistant that suggests recipe names based on user queries. Always return valid JSON arrays of recipe titles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content.trim();
    
    try {
      const parsed = JSON.parse(response);
      
      let suggestions;
      
      // Handle different response formats
      if (Array.isArray(parsed)) {
        // Direct array format
        suggestions = parsed;
      } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        // Object with suggestions array
        suggestions = parsed.suggestions;
      } else if (parsed.recipeTitles && Array.isArray(parsed.recipeTitles)) {
        // Object with recipeTitles array
        suggestions = parsed.recipeTitles;
      } else if (parsed.recipe_titles && Array.isArray(parsed.recipe_titles)) {
        // Object with recipe_titles array
        suggestions = parsed.recipe_titles;
      } else {
        console.error('Invalid suggestions format:', parsed);
        return [];
      }
      
      // Validate that all items are strings
      if (suggestions.every(item => typeof item === 'string')) {
        // Return up to 5 suggestions
        return suggestions.slice(0, 5);
      } else {
        console.error('Suggestions contain non-string items:', suggestions);
        return [];
      }
    } catch (parseError) {
      console.error('Error parsing suggestions JSON:', parseError);
      console.error('Raw response:', response);
      return [];
    }
    
  } catch (error) {
    console.error('Error generating recipe suggestions:', error);
    return [];
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

/**
 * Fetch top YouTube videos for a recipe using YouTube Data API
 * @param {string} recipeName - Name of the recipe
 * @returns {Promise<Array>} - Array of top 3 video results
 */
async function getYouTubeVideos(recipeName) {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not found. Video search disabled.');
    return [];
  }

  try {
    const searchQuery = encodeURIComponent(`${recipeName} recipe cooking tutorial`);
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${searchQuery}&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.error) {
      console.error('YouTube API error:', data.error);
      return [];
    }
    
    return data.items?.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    })) || [];
    
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

module.exports = {
  generateRecipe,
  generateRecipeSuggestions,
  getYouTubeSearchUrl,
  getYouTubeVideos
};
