# 🎥 YouTube Integration - Quick Setup

The Clove Recipe App now displays top 3 YouTube video tutorials for each recipe! Here's how to set it up:

## ✅ What's New

- **YouTube Videos Component**: Shows 3 relevant cooking videos for each recipe
- **Automatic Video Fetching**: Uses YouTube Data API v3 to find cooking tutorials
- **Responsive Grid Layout**: Videos display beautifully on all screen sizes
- **Video Information**: Shows video title, channel, and description
- **Error Handling**: Graceful fallbacks when videos can't be loaded

## 🔧 Quick Setup

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (same as Firebase project)
3. Enable "YouTube Data API v3" 
4. Create an API Key in Credentials section
5. (Optional) Restrict to YouTube Data API v3

### 2. Add API Key to Backend

Edit `/backend/.env` file:
```bash
# Add this line with your actual API key
YOUTUBE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
```

### 3. Restart Backend Server

```bash
cd backend
npm run dev
```

## 🎯 How It Works

1. When user views a recipe detail page
2. App calls `/api/recipe/{id}/videos` endpoint  
3. Backend fetches top 3 YouTube videos using recipe name
4. Frontend displays videos in responsive grid
5. Users can watch tutorials directly in the app

## 📱 Features

- **Embedded YouTube Player**: Watch videos without leaving the app
- **Video Metadata**: Title, channel, description for each video
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Mobile Responsive**: Works great on all devices

## 🛠 Technical Details

- **Backend**: New `/api/recipe/{id}/videos` endpoint
- **Frontend**: `YouTubeVideos.jsx` component 
- **Dependencies**: Uses existing `react-youtube` package
- **API**: YouTube Data API v3 search endpoint
- **Caching**: Videos cached by recipe for better performance

## 🚀 Current Status

✅ Backend API integration complete  
✅ Frontend component implemented  
✅ Recipe detail page updated  
⚠️ **Need YouTube API key to see videos**

The integration is complete and ready to use once you add your YouTube API key!
