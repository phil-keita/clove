
# Clove Recipe Application

## Project Overview

Clove is a comprehensive full-stack recipe application that combines AI-powered recipe generation with intelligent video tutorial integration. The application leverages OpenAI's GPT-4 for recipe creation and YouTube Data API v3 for curated cooking tutorials, providing users with both written instructions and visual guidance for their culinary adventures.

## Core Features

### Recipe Generation & Management
- **AI-Powered Recipe Creation**: Uses OpenAI GPT-4 to generate detailed recipes with structured ingredients, steps, difficulty levels, and cooking times
- **Recipe Search & Suggestions**: Intelligent recipe name suggestions based on user input queries
- **Recipe Caching**: Smart caching system that stores recipes in Firestore to reduce API costs and improve performance
- **Recipe Validation**: Comprehensive validation of recipe data structure and content quality
- **Popular Recipes**: Community-driven popular recipes based on user engagement and likes

### YouTube Integration & Video Analysis
- **Comprehensive Video Search**: YouTube Data API v3 integration for finding recipe-related cooking tutorials
- **Smart Video Categorization**: Automatic separation of YouTube Shorts (≤60s) and regular cooking videos
- **Video Analysis System**: AI-powered analysis of cooking videos to enhance recipe instructions with professional tips
- **Multiple Video Components**: Specialized components for displaying shorts, regular videos, and combined video carousels
- **Video Tutorial Enhancement**: Integration between video content and recipe instructions for improved cooking guidance

### User Authentication & Personalization
- **Firebase Authentication**: Secure user authentication system with email/password support
- **User Profiles**: Personal user accounts with profile management
- **Recipe Liking System**: Users can like/unlike recipes with real-time like count updates
- **Liked Recipes Collection**: Personal collection of favorited recipes accessible across sessions
- **Authentication Context**: Persistent authentication state management across the application

### Interactive Cooking Guide
- **Step-by-Step Cooking Mode**: Dedicated cooking guide interface for following recipes
- **Recipe Steps Navigation**: Sequential navigation through cooking instructions
- **Timer Integration**: Built-in timers for cooking steps that specify time requirements
- **Cooking State Management**: Track progress through recipe steps during cooking sessions

### User Interface & Experience
- **Modern React Architecture**: Built with React 19.1.0 and Vite 5.4.19 for optimal performance
- **Chakra UI Design System**: Consistent, accessible, and responsive design components
- **Framer Motion Animations**: Smooth animations and transitions throughout the application
- **Dark/Light Mode Support**: User preference-based theme switching
- **Responsive Design**: Mobile-first responsive design for all device types
- **Error Boundaries**: Comprehensive error handling and user feedback systems

### Backend Architecture & Services
- **Express.js API Server**: Robust REST API with comprehensive endpoint coverage
- **Firebase Firestore Integration**: NoSQL database for recipe storage and user data
- **YouTube Data API Integration**: Direct integration for video search and metadata retrieval
- **OpenAI API Integration**: Advanced AI integration for recipe generation and video analysis
- **Authentication Middleware**: Secure API endpoints with Firebase authentication verification
- **Error Handling**: Comprehensive error handling and logging throughout the backend

## Technical Implementation

### Backend Services (Node.js/Express)

#### API Endpoints
- `GET /api/health` - Health check endpoint for service monitoring
- `POST /api/recipe/suggestions` - AI-powered recipe name suggestions
- `POST /api/recipe/generate` - Generate detailed recipes using OpenAI GPT-4
- `GET /api/recipe/:recipeId` - Retrieve specific recipe data
- `GET /api/recipe/:recipeId/videos` - Get YouTube videos for specific recipes
- `POST /api/recipe/:recipeId/analyze-video` - AI analysis of video tutorials for recipe enhancement
- `POST /api/recipe/like` - Like/unlike recipes (authenticated)
- `GET /api/user/liked-recipes` - Get user's liked recipes (authenticated)
- `GET /api/recipes/popular` - Get community popular recipes

#### Core Modules
- **api.js**: Main Express server with all API endpoints and middleware
- **llm.js**: OpenAI integration for recipe generation, suggestions, and video analysis
- **youtube.js**: YouTube Data API v3 integration for video search and categorization
- **firebase.js**: Firebase Admin SDK configuration and Firestore operations
- **utils.js**: Utility functions for data processing and validation

#### Key Features
- Recipe caching system to minimize OpenAI API costs
- Automatic video categorization (Shorts vs Regular videos)
- Comprehensive input validation and error handling
- Firebase Authentication middleware for protected endpoints
- Recipe freshness checking (24-hour cache validity)

### Frontend Architecture (React/Vite)

#### Core Pages
- **Home.jsx**: Main landing page with recipe search and popular recipes
- **HomeSimple.jsx**: Simplified version of home page
- **RecipeDetail.jsx**: Detailed recipe view with ingredients, steps, and videos
- **CookingGuide.jsx**: Interactive step-by-step cooking mode with timers
- **LikedRecipes.jsx**: Personal collection of favorited recipes
- **PopularRecipes.jsx**: Community popular recipes page
- **Profile.jsx**: User profile management
- **Auth.jsx**: Authentication page for login/signup

#### Component Structure
- **Auth/AuthForm.jsx**: Authentication forms and validation
- **Navigation/Navigation.jsx**: Application navigation and routing
- **RecipeSearch/RecipeSearch.jsx**: Recipe search interface with suggestions
- **RecipeDisplay/**: Recipe display components and layouts
- **RecipeLike/RecipeLike.jsx**: Recipe liking functionality
- **RecipeSteps/**: Step-by-step cooking guide components
  - `RecipeGuide.jsx`: Main cooking guide interface
  - `RecipeStep.jsx`: Individual step display with timer support
- **YouTubeVideos/**: Comprehensive video integration components
  - `YouTubeVideos.jsx`: Main video display coordinator
  - `YouTubeCarousel.jsx`: Video carousel for multiple videos
  - `YouTubeRegularVideos.jsx`: Regular cooking videos display
  - `YouTubeShorts.jsx`: YouTube Shorts specialized display
  - `VideoDetailsModal.jsx`: Detailed video information modal

#### Context Management
- **AuthContext.jsx**: User authentication state management
- **RecipeContext.jsx**: Recipe data and cooking state management

#### Services
- **api.js**: Centralized API service with axios for backend communication
- **firebase.js**: Frontend Firebase configuration and authentication

### Database Schema (Firebase Firestore)

#### Collections Structure
- **recipes/**: Recipe documents with generated content, metadata, and engagement data
- **users/{userId}/likedRecipes/**: User's liked recipes subcollection
- Recipe documents include: ingredients, steps, difficulty, timing, likes count, search metrics

### Technology Stack

#### Frontend Technologies
- **React 19.1.0**: Latest React version with modern hooks and features
- **Vite 5.4.19**: Fast build tool and development server
- **Chakra UI**: Component library for consistent design system
- **Framer Motion**: Animation library for smooth user interactions
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing and navigation

#### Backend Technologies
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **Firebase Admin SDK**: Backend Firebase integration
- **OpenAI API**: GPT-4 integration for AI-powered features
- **YouTube Data API v3**: Video search and metadata retrieval
- **Axios**: HTTP client for external API calls

#### Development & Deployment
- **Firebase Hosting**: Frontend deployment platform
- **Firebase Functions**: Serverless backend deployment option
- **Environment Configuration**: Secure API key management
- **Professional Documentation**: Comprehensive setup and usage guides

## Development Status & Features Implemented

### Completed Features

#### Core Recipe System
- AI-powered recipe generation with OpenAI GPT-4 integration
- Structured recipe data with ingredients, steps, difficulty, and timing
- Recipe caching system for cost optimization and performance
- Recipe validation and error handling
- Recipe search suggestions with intelligent matching

#### YouTube Integration
- Complete YouTube Data API v3 integration
- Automatic video search for recipe-related content
- Smart categorization of YouTube Shorts vs regular videos
- Video metadata retrieval and display
- AI-powered video tutorial analysis for recipe enhancement
- Multiple specialized video display components

#### User Management
- Firebase Authentication integration
- User profile system and account management
- Recipe liking/unliking functionality with real-time updates
- Personal liked recipes collection
- Popular recipes based on community engagement

#### Frontend Experience
- Modern React application with Vite build system
- Comprehensive Chakra UI design system implementation
- Responsive design for all device types
- Framer Motion animations and transitions
- Dark/light mode support
- Error boundaries and user feedback systems

#### Interactive Cooking
- Step-by-step cooking guide interface
- Recipe navigation with progress tracking
- Timer integration for cooking steps
- Interactive cooking session management

#### Backend Infrastructure
- Complete Express.js API server with 9 major endpoints
- Firebase Firestore integration for data persistence
- Authentication middleware for protected routes
- Comprehensive error handling and logging
- Environment-based configuration management

### Technical Specifications

#### Performance Optimizations
- Recipe caching with 24-hour freshness checks
- Lazy loading of video content
- Optimized API calls with batching
- Efficient Firestore queries and indexing

#### Security Implementation
- JWT token-based authentication
- API endpoint protection with middleware
- Input validation and sanitization
- Secure environment variable management

#### Code Quality
- Professional documentation with setup guides
- Consistent code structure and naming conventions
- Error boundary implementation
- Comprehensive testing setup ready

## Project Structure

```
backend/
├── src/
│   ├── api.js          # Main Express server with all endpoints
│   ├── firebase.js     # Firebase Admin SDK configuration
│   ├── llm.js          # OpenAI GPT-4 integration
│   ├── youtube.js      # YouTube Data API v3 service
│   └── utils.js        # Utility functions and helpers
├── package.json        # Backend dependencies and scripts
└── serviceAccountKey.json # Firebase service account

frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Application pages and routes
│   ├── context/       # React Context providers
│   ├── services/      # API services and utilities
│   └── assets/        # Static assets and resources
├── package.json       # Frontend dependencies and scripts
└── vite.config.js     # Vite build configuration
```

## Getting Started

The application includes comprehensive setup documentation:
- **SETUP_GUIDE.md**: Complete development environment setup
- **YOUTUBE_SETUP.md**: YouTube Data API configuration
- **README.md**: Project overview and quick start
- **setup.sh**: Automated setup script for dependencies

## Future Enhancement Opportunities

- Recipe sharing and social features
- Advanced meal planning and grocery lists
- Voice-guided cooking instructions
- Recipe rating and review system
- Advanced search filters and categories
- Mobile app development
- Integration with smart kitchen devices
- Multi-language recipe support
