// YouTube Data API service for fetching video information
// Provides functionality to search for recipe-related videos and get video details
const axios = require('axios');
require('dotenv').config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Search for YouTube videos related to a recipe
 * @param {string} recipeName - Name of the recipe to search for
 * @param {number} maxResults - Maximum number of results (default: 10)
 * @returns {Promise<Object>} - Object with regularVideos and shorts arrays
 */
async function searchRecipeVideos(recipeName, maxResults = 10) {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    const searchQuery = `${recipeName} recipe cooking tutorial`;
    const searchUrl = `${YOUTUBE_API_BASE_URL}/search`;
    
    const response = await axios.get(searchUrl, {
      params: {
        key: YOUTUBE_API_KEY,
        q: searchQuery,
        type: 'video',
        part: 'snippet',
        maxResults: maxResults,
        order: 'relevance',
        videoDuration: 'any',
        safeSearch: 'strict'
      }
    });

    if (!response.data || !response.data.items) {
      console.warn('No videos found for recipe:', recipeName);
      return { regularVideos: [], shorts: [] };
    }

    // Get detailed video information to determine duration and category
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    const detailsUrl = `${YOUTUBE_API_BASE_URL}/videos`;
    
    const detailsResponse = await axios.get(detailsUrl, {
      params: {
        key: YOUTUBE_API_KEY,
        id: videoIds,
        part: 'snippet,contentDetails,statistics'
      }
    });

    const videos = detailsResponse.data.items || [];
    
    // Separate videos into regular videos and shorts
    const regularVideos = [];
    const shorts = [];
    
    videos.forEach(video => {
      const duration = video.contentDetails?.duration || '';
      const isShort = isYouTubeShort(duration);
      
      const videoData = {
        videoId: video.id,
        title: video.snippet?.title || 'Unknown Title',
        description: video.snippet?.description || '',
        channelTitle: video.snippet?.channelTitle || 'Unknown Channel',
        publishedAt: video.snippet?.publishedAt,
        thumbnails: video.snippet?.thumbnails,
        duration: duration,
        viewCount: video.statistics?.viewCount || '0',
        likeCount: video.statistics?.likeCount || '0'
      };
      
      if (isShort) {
        shorts.push(videoData);
      } else {
        regularVideos.push(videoData);
      }
    });

    console.log(`Found ${regularVideos.length} regular videos and ${shorts.length} shorts for recipe: ${recipeName}`);
    
    return {
      regularVideos: regularVideos.slice(0, 5), // Limit to 5 regular videos
      shorts: shorts.slice(0, 8) // Limit to 8 shorts
    };

  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    
    // Return empty arrays on error
    return {
      regularVideos: [],
      shorts: [],
      error: error.message
    };
  }
}

/**
 * Determine if a video is a YouTube Short based on duration
 * @param {string} duration - ISO 8601 duration string (e.g., "PT15M33S")
 * @returns {boolean} - True if video is likely a Short (60 seconds or less)
 */
function isYouTubeShort(duration) {
  if (!duration) return false;
  
  // Parse ISO 8601 duration (PT15M33S format)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  // YouTube Shorts are typically 60 seconds or less
  return totalSeconds <= 60;
}

/**
 * Get detailed information about a specific video
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} - Video details
 */
async function getVideoDetails(videoId) {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    const url = `${YOUTUBE_API_BASE_URL}/videos`;
    
    const response = await axios.get(url, {
      params: {
        key: YOUTUBE_API_KEY,
        id: videoId,
        part: 'snippet,contentDetails,statistics'
      }
    });

    const video = response.data.items?.[0];
    if (!video) {
      throw new Error('Video not found');
    }

    return {
      videoId: video.id,
      title: video.snippet?.title || 'Unknown Title',
      description: video.snippet?.description || '',
      channelTitle: video.snippet?.channelTitle || 'Unknown Channel',
      publishedAt: video.snippet?.publishedAt,
      thumbnails: video.snippet?.thumbnails,
      duration: video.contentDetails?.duration || '',
      viewCount: video.statistics?.viewCount || '0',
      likeCount: video.statistics?.likeCount || '0'
    };

  } catch (error) {
    console.error('Error getting video details:', error);
    throw error;
  }
}

module.exports = {
  searchRecipeVideos,
  getVideoDetails,
  isYouTubeShort
};
