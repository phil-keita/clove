// Firebase Database Initialization Script
// Run this in your browser console on the Firebase Console page or create a separate initialization script

// Sample data structure for your Clove app

const sampleRecipes = [
  {
    id: 'recipe_1',
    name: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale',
      '4 large eggs',
      '100g Pecorino Romano cheese',
      'Black pepper',
      'Salt'
    ],
    steps: [
      'Boil salted water and cook spaghetti until al dente',
      'Fry pancetta until crispy',
      'Whisk eggs with grated cheese and black pepper',
      'Combine hot pasta with pancetta',
      'Remove from heat and mix with egg mixture',
      'Serve immediately with extra cheese'
    ],
    cookingTime: 20,
    servings: 4,
    difficulty: 'Medium',
    tags: ['Italian', 'Pasta', 'Quick'],
    createdAt: new Date(),
    createdBy: 'system',
    likes: 0,
    youtubeVideoId: 'dQw4w9WgXcQ' // Replace with actual cooking video ID
  },
  {
    id: 'recipe_2',
    name: 'Chicken Tikka Masala',
    description: 'Creamy and flavorful Indian curry with tender chicken',
    ingredients: [
      '500g chicken breast',
      '200ml coconut milk',
      '400g canned tomatoes',
      '2 tbsp tikka masala paste',
      '1 onion',
      '3 garlic cloves',
      'Fresh coriander',
      'Basmati rice'
    ],
    steps: [
      'Cut chicken into chunks and marinate with spices',
      'Fry chicken until golden',
      'Sauté onions and garlic',
      'Add tikka masala paste and tomatoes',
      'Simmer with coconut milk',
      'Add chicken back and cook until tender',
      'Garnish with coriander and serve with rice'
    ],
    cookingTime: 45,
    servings: 4,
    difficulty: 'Medium',
    tags: ['Indian', 'Curry', 'Spicy'],
    createdAt: new Date(),
    createdBy: 'system',
    likes: 0,
    youtubeVideoId: 'dQw4w9WgXcQ'
  }
];

const popularRecipes = [
  {
    id: 'recipe_1',
    name: 'Classic Spaghetti Carbonara',
    likes: 127,
    views: 1540,
    lastUpdated: new Date()
  },
  {
    id: 'recipe_2',
    name: 'Chicken Tikka Masala',
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

console.log('Sample data structure for Clove Recipe App');
console.log('Recipes:', sampleRecipes);
console.log('Popular Recipes:', popularRecipes);
