// Firebase Database Initialization Script
// Run this in your browser console on the Firebase Console page or create a separate initialization script

// Sample data structure for your Clove app

// Firebase Database Initialization Script
// Sample data structure for your Clove app - Updated to match current schema

const sampleRecipes = [
  {
    recipeId: 'recipe_1',
    recipeName: 'classic spaghetti carbonara', // normalized lowercase
    displayName: 'Classic Spaghetti Carbonara', // display version
    name: 'Classic Spaghetti Carbonara', // frontend compatibility
    description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
    ingredients: [
      { name: 'spaghetti', quantity: '400g', unit: '' },
      { name: 'pancetta or guanciale', quantity: '200g', unit: '' },
      { name: 'large eggs', quantity: '4', unit: 'pieces' },
      { name: 'Pecorino Romano cheese', quantity: '100g', unit: '' },
      { name: 'black pepper', quantity: 'to taste', unit: '' },
      { name: 'salt', quantity: 'to taste', unit: '' }
    ],
    steps: [
      { description: 'Boil salted water and cook spaghetti until al dente', timeMinutes: 12 },
      { description: 'Fry pancetta until crispy', timeMinutes: 5 },
      { description: 'Whisk eggs with grated cheese and black pepper' },
      { description: 'Combine hot pasta with pancetta' },
      { description: 'Remove from heat and mix with egg mixture' },
      { description: 'Serve immediately with extra cheese' }
    ],
    difficulty: 'Medium',
    estimatedTime: 25,
    servings: 4,
    likes: 0,
    createdAt: new Date(),
    lastSearched: new Date(),
    searchCount: 1
  },
  {
    recipeId: 'recipe_2',
    recipeName: 'chicken tikka masala', // normalized lowercase
    displayName: 'Chicken Tikka Masala', // display version
    name: 'Chicken Tikka Masala', // frontend compatibility
    description: 'Creamy and flavorful Indian curry with tender chicken',
    ingredients: [
      { name: 'chicken breast', quantity: '500g', unit: '' },
      { name: 'coconut milk', quantity: '200ml', unit: '' },
      { name: 'canned tomatoes', quantity: '400g', unit: '' },
      { name: 'tikka masala paste', quantity: '2', unit: 'tbsp' },
      { name: 'onion', quantity: '1', unit: 'large' },
      { name: 'garlic cloves', quantity: '3', unit: 'pieces' },
      { name: 'fresh coriander', quantity: '1', unit: 'bunch' },
      { name: 'basmati rice', quantity: '300g', unit: '' }
    ],
    steps: [
      { description: 'Cut chicken into chunks and marinate with spices', timeMinutes: 15 },
      { description: 'Fry chicken until golden', timeMinutes: 8 },
      { description: 'Sauté onions and garlic', timeMinutes: 5 },
      { description: 'Add tikka masala paste and tomatoes', timeMinutes: 3 },
      { description: 'Simmer with coconut milk', timeMinutes: 10 },
      { description: 'Add chicken back and cook until tender', timeMinutes: 10 },
      { description: 'Garnish with coriander and serve with rice' }
    ],
    difficulty: 'Medium',
    estimatedTime: 50,
    servings: 4,
    likes: 0,
    createdAt: new Date(),
    lastSearched: new Date(),
    searchCount: 1
  }
];

const popularRecipes = [
  {
    recipeId: 'recipe_1', // Use recipeId instead of id
    recipeName: 'classic spaghetti carbonara',
    displayName: 'Classic Spaghetti Carbonara',
    likes: 127,
    views: 1540,
    lastUpdated: new Date()
  },
  {
    recipeId: 'recipe_2',
    recipeName: 'chicken tikka masala', 
    displayName: 'Chicken Tikka Masala',
    likes: 89,
    views: 987,
    lastUpdated: new Date()
  }
];

// Database structure:
// /recipes/{recipeId} - Individual recipe documents
// /popularRecipes/{recipeId} - Popular recipes with stats
// /users/{userId} - User profiles
// /userLikes/{userId}/recipes/{recipeId} - User's liked recipes
// /analytics/{document=**} - Analytics and stats

// Updated data structure changes:
// - ingredients: now array of objects with {name, quantity, unit}
// - steps: now array of objects with {description, timeMinutes (optional)}
// - recipeId: MD5 hash of recipe name for consistent IDs
// - recipeName: normalized lowercase name for searching
// - displayName: human-readable name for display
// - estimatedTime: total recipe time in minutes
// - searchCount: track popularity
// - lastSearched: for freshness tracking

console.log('Sample data structure for Clove Recipe App');
console.log('Recipes:', sampleRecipes);
console.log('Popular Recipes:', popularRecipes);
