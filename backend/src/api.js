// This Express API has routes to generate recipes using OpenAI, manage likes, and return data from Firestore.
// All business logic for recipe lookup, caching, and LLM calls happen here.
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import our modules
const { db, admin } = require('./firebase');
const { generateRecipe, getYouTubeSearchUrl } = require('./llm');
const { searchRecipeVideos } = require('./youtube');
const { 
  generateRecipeId, 
  validateRecipeData, 
  formatRecipeForStorage, 
  normalizeRecipeName,
  isRecipeFresh 
} = require('./utils');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to verify Firebase auth token
async function verifyAuthToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization token provided' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    res.status(401).json({ error: 'Invalid authorization token' });
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Recipe API is running',
    timestamp: new Date().toISOString()
  });
});

// POST /api/recipe/suggestions - Get recipe suggestions based on user input
app.post('/api/recipe/suggestions', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: 'Query is required and must be a string' 
      });
    }
    
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return res.json({ suggestions: [] });
    }
    
    // If query is very short (1-2 characters), don't provide suggestions
    if (trimmedQuery.length < 3) {
      return res.json({ suggestions: [] });
    }
    
    // Generate intelligent recipe suggestions using OpenAI
    const { generateRecipeSuggestions } = require('./llm');
    const suggestions = await generateRecipeSuggestions(trimmedQuery);
    
    res.json({ 
      suggestions: suggestions || [],
      query: trimmedQuery
    });
    
  } catch (error) {
    console.error('Error generating recipe suggestions:', error);
    res.status(500).json({ 
      error: 'Internal server error while generating suggestions',
      suggestions: []
    });
  }
});

// POST /api/recipe/generate - Generate or retrieve a recipe
app.post('/api/recipe/generate', async (req, res) => {
  try {
    const { recipeName } = req.body;
    
    if (!recipeName || typeof recipeName !== 'string') {
      return res.status(400).json({ 
        error: 'Recipe name is required and must be a string' 
      });
    }
    
    const normalizedName = normalizeRecipeName(recipeName);
    if (!normalizedName) {
      return res.status(400).json({ 
        error: 'Invalid recipe name provided' 
      });
    }
    
    const recipeId = generateRecipeId(normalizedName);
    
    // Check if recipe exists in Firestore cache
    const recipeRef = db.collection('recipes').doc(recipeId);
    const recipeDoc = await recipeRef.get();
    
    if (recipeDoc.exists) {
      const existingRecipe = recipeDoc.data();
      
      // Check if recipe is fresh (less than 24 hours old)
      if (isRecipeFresh(existingRecipe.lastSearched?.toDate())) {
        // Update search count and last searched time
        await recipeRef.update({
          lastSearched: new Date(),
          searchCount: (existingRecipe.searchCount || 0) + 1
        });
        
        // Add YouTube search URL
        const youtubeUrl = getYouTubeSearchUrl(recipeName);
        
        res.json({
          ...existingRecipe,
          lastSearched: new Date(),
          searchCount: (existingRecipe.searchCount || 0) + 1,
          youtubeUrl,
          cached: true
        });
        return;
      }
    }
    
    // Generate new recipe using OpenAI
    console.log(`Generating new recipe for: ${recipeName}`);
    const generatedRecipe = await generateRecipe(recipeName);
    
    if (!validateRecipeData(generatedRecipe)) {
      return res.status(500).json({ 
        error: 'Failed to generate valid recipe data' 
      });
    }
    
    // Format recipe for storage
    const formattedRecipe = formatRecipeForStorage(generatedRecipe, recipeName, recipeId);
    
    // Add YouTube search URL
    const youtubeUrl = getYouTubeSearchUrl(recipeName);
    formattedRecipe.youtubeUrl = youtubeUrl;
    
    // Save to Firestore
    await recipeRef.set(formattedRecipe);
    
    res.json({
      ...formattedRecipe,
      cached: false
    });
    
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ 
      error: 'Internal server error while generating recipe' 
    });
  }
});

// GET /api/recipe/:recipeId - Get a recipe by ID
app.get('/api/recipe/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    if (!recipeId) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }
    
    const recipeRef = db.collection('recipes').doc(recipeId);
    const recipeDoc = await recipeRef.get();
    
    if (!recipeDoc.exists) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    const recipe = recipeDoc.data();
    
    // Add YouTube search URL if not present
    if (!recipe.youtubeUrl) {
      recipe.youtubeUrl = getYouTubeSearchUrl(recipe.displayName || recipe.recipeName);
    }
    
    res.json(recipe);
    
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching recipe' 
    });
  }
});

// POST /api/recipe/like - Like/unlike a recipe (requires authentication)
app.post('/api/recipe/like', verifyAuthToken, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.uid;
    
    if (!recipeId) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }
    
    // Check if recipe exists
    const recipeRef = db.collection('recipes').doc(recipeId);
    const recipeDoc = await recipeRef.get();
    
    if (!recipeDoc.exists) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Check if user has already liked this recipe
    const userLikeRef = db.collection('users').doc(userId).collection('likedRecipes').doc(recipeId);
    const userLikeDoc = await userLikeRef.get();
    
    let isLiked = userLikeDoc.exists;
    let likesChange = 0;
    
    if (isLiked) {
      // Unlike the recipe
      await userLikeRef.delete();
      likesChange = -1;
      isLiked = false;
    } else {
      // Like the recipe
      await userLikeRef.set({
        recipeId,
        likedAt: new Date()
      });
      likesChange = 1;
      isLiked = true;
    }
    
    // Update recipe likes count
    await recipeRef.update({
      likes: admin.firestore.FieldValue.increment(likesChange)
    });
    
    // Get updated recipe data
    const updatedRecipeDoc = await recipeRef.get();
    const updatedRecipe = updatedRecipeDoc.data();
    
    res.json({
      success: true,
      isLiked,
      likes: updatedRecipe.likes || 0,
      message: isLiked ? 'Recipe liked successfully' : 'Recipe unliked successfully'
    });
    
  } catch (error) {
    console.error('Error toggling recipe like:', error);
    res.status(500).json({ 
      error: 'Internal server error while toggling like' 
    });
  }
});

// GET /api/user/liked-recipes - Get user's liked recipes (requires authentication)
app.get('/api/user/liked-recipes', verifyAuthToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Get user's liked recipes
    const likedRecipesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('likedRecipes')
      .orderBy('likedAt', 'desc')
      .get();
    
    const likedRecipeIds = [];
    likedRecipesSnapshot.forEach(doc => {
      likedRecipeIds.push(doc.id);
    });
    
    if (likedRecipeIds.length === 0) {
      return res.json([]);
    }
    
    // Get recipe details for liked recipes
    const recipesPromises = likedRecipeIds.map(recipeId => 
      db.collection('recipes').doc(recipeId).get()
    );
    
    const recipeDocs = await Promise.all(recipesPromises);
    const likedRecipes = [];
    
    recipeDocs.forEach(doc => {
      if (doc.exists) {
        const recipe = doc.data();
        // Add YouTube URL if not present
        if (!recipe.youtubeUrl) {
          recipe.youtubeUrl = getYouTubeSearchUrl(recipe.displayName || recipe.recipeName);
        }
        likedRecipes.push(recipe);
      }
    });
    
    res.json(likedRecipes);
    
  } catch (error) {
    console.error('Error fetching liked recipes:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching liked recipes' 
    });
  }
});

// GET /api/recipes/popular - Get popular recipes
app.get('/api/recipes/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get recipes ordered by likes count
    const recipesSnapshot = await db
      .collection('recipes')
      .orderBy('likes', 'desc')
      .limit(limit)
      .get();
    
    const popularRecipes = [];
    recipesSnapshot.forEach(doc => {
      const recipe = doc.data();
      // Add YouTube URL if not present
      if (!recipe.youtubeUrl) {
        recipe.youtubeUrl = getYouTubeSearchUrl(recipe.displayName || recipe.recipeName);
      }
      popularRecipes.push(recipe);
    });
    
    res.json(popularRecipes);
    
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching popular recipes' 
    });
  }
});

// GET /api/recipe/:recipeId/videos - Get YouTube videos for a recipe
app.get('/api/recipe/:recipeId/videos', async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    if (!recipeId) {
      return res.status(400).json({ 
        error: 'Recipe ID is required' 
      });
    }
    
    // Get the recipe from Firestore to get the recipe name
    const recipeRef = db.collection('recipes').doc(recipeId);
    const recipeDoc = await recipeRef.get();
    
    if (!recipeDoc.exists) {
      return res.status(404).json({ 
        error: 'Recipe not found' 
      });
    }
    
    const recipe = recipeDoc.data();
    const recipeName = recipe.name || recipe.displayName || recipe.recipeName || 'Unknown Recipe';
    
    console.log(`Fetching YouTube videos for recipe: ${recipeName} (ID: ${recipeId})`);
    
    // Search for YouTube videos
    const videoResults = await searchRecipeVideos(recipeName);
    
    res.json({
      success: true,
      recipeId,
      recipeName,
      regularVideos: videoResults.regularVideos || [],
      shorts: videoResults.shorts || [],
      totalRegularVideos: videoResults.regularVideos?.length || 0,
      totalShorts: videoResults.shorts?.length || 0,
      message: 'Videos fetched successfully'
    });
    
  } catch (error) {
    console.error('Error fetching recipe videos:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recipe videos',
      message: error.message
    });
  }
});

// POST /api/recipe/:recipeId/analyze-video - Analyze video tutorial for recipe enhancement
app.post('/api/recipe/:recipeId/analyze-video', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { videoId, title, channelTitle, description } = req.body;
    
    if (!recipeId || !videoId) {
      return res.status(400).json({ 
        error: 'Recipe ID and video ID are required' 
      });
    }
    
    // Get the recipe from Firestore
    const recipeRef = db.collection('recipes').doc(recipeId);
    const recipeDoc = await recipeRef.get();
    
    if (!recipeDoc.exists) {
      return res.status(404).json({ 
        error: 'Recipe not found' 
      });
    }
    
    const recipe = recipeDoc.data();
    const videoInfo = {
      videoId,
      title: title || 'Unknown Video',
      channelTitle: channelTitle || 'Unknown Channel',
      description: description || ''
    };
    
    // Use the video analysis function from LLM module
    const { analyzeVideoTutorial } = require('./llm');
    const enhancedRecipe = await analyzeVideoTutorial(recipe, videoInfo);
    
    console.log(`Video analysis completed for recipe: ${recipe.name}, video: ${videoInfo.title}`);
    
    res.json({
      success: true,
      recipeId,
      videoId,
      enhancedRecipe,
      message: 'Video tutorial analyzed successfully'
    });
    
  } catch (error) {
    console.error('Error analyzing video tutorial:', error);
    res.status(500).json({ 
      error: 'OpenAI service error',
      message: 'Failed to analyze video tutorial'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`Recipe API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
