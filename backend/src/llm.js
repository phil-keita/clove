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
      const suggestions = JSON.parse(response);
      
      // Validate that we got an array of strings
      if (Array.isArray(suggestions) && suggestions.every(item => typeof item === 'string')) {
        // Return up to 5 suggestions
        return suggestions.slice(0, 5);
      } else {
        console.error('Invalid suggestions format:', suggestions);
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
 * Analyze a video tutorial and provide enhanced recipe instructions
 * @param {Object} recipe - The original recipe data
 * @param {Object} video - Video information with title, description, etc.
 * @returns {Promise<Object>} - Enhanced recipe with video-based improvements
 */
async function analyzeVideoTutorial(recipe, video) {
  try {
    const prompt = `You are analyzing a cooking video tutorial to enhance a recipe. Here's the original recipe and video information:

ORIGINAL RECIPE:
Title: ${recipe.name}
Ingredients: ${recipe.ingredients?.map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`).join(', ')}
Instructions: ${recipe.steps?.map((step, i) => `${i+1}. ${step.description}`).join('\n')}

VIDEO INFORMATION:
Title: ${video.title}
Channel: ${video.channelTitle}
Description: ${video.description || 'No description available'}

Please analyze this video tutorial and enhance the original recipe instructions with insights that would likely come from watching the video. Focus on:
1. Additional cooking tips or techniques
2. Temperature details or timing adjustments
3. Visual cues to look for
4. Common mistakes to avoid
5. Professional techniques

Return a JSON object with enhanced instructions that incorporate video-based insights:
{
  "enhancedSteps": [
    {
      "description": "enhanced instruction with video insights",
      "timeMinutes": optional_time_if_applicable,
      "videoTip": "specific tip from video analysis"
    }
  ],
  "videoInsights": [
    "Key insight 1 from video",
    "Key insight 2 from video"
  ],
  "enhancedBy": "${video.title}"
}

Return only valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef assistant that analyzes cooking videos to enhance recipes with practical cooking insights and techniques."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = completion.choices[0].message.content.trim();
    
    // Parse the JSON response
    let enhancedRecipe;
    try {
      enhancedRecipe = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing video analysis JSON:', parseError);
      console.log('Raw content:', content);
      
      // Fallback response if JSON parsing fails
      return {
        enhancedSteps: recipe.steps || [],
        videoInsights: ["Video analysis temporarily unavailable. Original recipe instructions preserved."],
        enhancedBy: video.title,
        error: "Failed to parse video analysis"
      };
    }

    return enhancedRecipe;
    
  } catch (error) {
    console.error('Error analyzing video tutorial:', error);
    
    // Return fallback response
    return {
      enhancedSteps: recipe.steps || [],
      videoInsights: ["Video analysis temporarily unavailable. Please try again later."],
      enhancedBy: video.title,
      error: error.message
    };
  }
}

module.exports = {
  generateRecipe,
  generateRecipeSuggestions,
  getYouTubeSearchUrl,
  analyzeVideoTutorial
};
