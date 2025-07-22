# YouTube Integration Setup

The Clove Recipe App includes comprehensive YouTube video integration with AI-powered video analysis. This guide explains how to configure the YouTube Data API for full functionality.

## Features

- **Smart Video Search**: Automatically finds relevant cooking tutorials for each recipe
- **Video Categorization**: Separates YouTube Shorts (≤60s) from regular cooking videos
- **AI Video Analysis**: Uses OpenAI to analyze video content and enhance recipe instructions
- **Multiple Video Components**: Specialized displays for shorts, regular videos, and carousels  
- **Video Tutorial Enhancement**: Integrates video insights into recipe instructions
- **Responsive Design**: Optimized video displays for all screen sizes
- **Error Handling**: Graceful fallbacks when videos cannot be loaded

## Setup Instructions

### 1. Get YouTube Data API v3 Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (same as Firebase project)
3. Enable "YouTube Data API v3":
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated key
5. (Recommended) Restrict the API key:
   - Click on the API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Save changes

### 2. Add API Key to Backend

Edit `/backend/.env` file:
```bash
# Add this line with your actual API key
YOUTUBE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
```

### 3. Restart Backend Server

```bash
cd backend
npm start
```

## How It Works

### Video Search & Categorization
1. User views a recipe detail page
2. App calls `/api/recipe/{recipeId}/videos` endpoint  
3. Backend searches YouTube using recipe name + "cooking tutorial"
4. System automatically categorizes videos:
   - **YouTube Shorts**: Videos ≤60 seconds (cooking tips, quick demos)
   - **Regular Videos**: Longer tutorials and detailed guides
5. Frontend displays videos in specialized components

### AI Video Analysis
1. User can click "Analyze Video" on any video tutorial
2. App calls `/api/recipe/{recipeId}/analyze-video` endpoint
3. OpenAI analyzes video metadata and description
4. System generates enhanced recipe instructions with:
   - Professional cooking techniques from the video
   - Visual cues and timing tips
   - Common mistakes to avoid
   - Temperature and texture guidance

## Frontend Components

- **YouTubeVideos.jsx**: Main coordinator component
- **YouTubeCarousel.jsx**: Horizontal scrolling video carousel
- **YouTubeRegularVideos.jsx**: Grid display for full-length tutorials
- **YouTubeShorts.jsx**: Specialized display for cooking shorts
- **VideoDetailsModal.jsx**: Detailed video information modal
- **YouTubeRegularVideosOnly.jsx**: Regular videos only view
- **YouTubeShortsOnly.jsx**: Shorts only view

## Technical Implementation

### Backend (Node.js/Express)
- **youtube.js**: YouTube Data API v3 service module
  - `searchRecipeVideos()`: Search for cooking videos
  - `isYouTubeShort()`: Categorize videos by duration  
  - `getVideoDetails()`: Fetch detailed video metadata
- **API Endpoints**:
  - `GET /api/recipe/{recipeId}/videos`: Get videos for recipe
  - `POST /api/recipe/{recipeId}/analyze-video`: AI video analysis
- **Dependencies**: axios for API calls, YouTube Data API v3

### Frontend (React/Vite)
- **7 specialized video components** for different display modes
- **react-youtube**: Embedded video player integration
- **Responsive design**: Mobile-first video layouts  
- **Error boundaries**: Graceful handling of video failures
- **Loading states**: User feedback during video fetching

## API Usage & Costs

### YouTube Data API Quotas
- **Free tier**: 10,000 units per day
- **Video search**: 100 units per search
- **Video details**: 1 unit per video
- **Estimated usage**: ~100-200 searches per day for development

### Rate Limiting
- Built-in error handling for quota exceeded
- Graceful fallbacks when API limits reached
- Video results cached by recipe for efficiency

## Current Status

### Fully Implemented Features
- Complete YouTube Data API v3 integration
- Backend video search and categorization service
- 7 specialized frontend video components
- AI-powered video tutorial analysis
- Recipe detail page video integration
- Mobile-responsive video displays
- Error handling and loading states

### Requires API Key
- Video search and display functionality
- AI video analysis features
- **All video features are ready - just add your YouTube API key!**

### Ready to Use
Once you add your YouTube API key, users can:
- View curated cooking videos for each recipe
- Watch YouTube Shorts for quick cooking tips
- Analyze video tutorials to enhance recipe instructions  
- Get professional cooking techniques from video content
- Access video tutorials without leaving the app

The YouTube integration is production-ready and waiting for your API key configuration.
