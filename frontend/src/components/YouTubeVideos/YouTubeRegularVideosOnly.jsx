import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Badge,
  Button,
} from '@chakra-ui/react';
import YouTube from 'react-youtube';
import { apiService } from '../../services/api';

const YouTubeRegularVideosOnly = ({ recipeId, recipeName, onUseVideoTutorial, activeVideoEnhancement, videoEnhancementLoading }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!recipeId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getRecipeVideos(recipeId);
        console.log('Regular videos API response:', response);
        setVideos(response.regularVideos || []);
        
      } catch (error) {
        console.error('Error fetching regular videos:', error);
        setError('Failed to load recipe videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [recipeId]);

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="green.500" />
        <Text mt={4} color="gray.600">Loading recipe videos...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (videos.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.600">No video tutorials found for this recipe.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={6} color="green.700">
        Recipe Video Tutorials
      </Heading>
      
      <VStack spacing={6} align="stretch">
        {videos.map((video) => (
          <Box 
            key={video.videoId}
            bg="white" 
            borderRadius="lg" 
            overflow="hidden"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            transition="transform 0.2s"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
          >
            <Box 
              position="relative"
              bg="blue.50"
              w="100%"
              h="200px"
              overflow="hidden"
            >
              <YouTube 
                videoId={video.videoId} 
                opts={{
                  height: '200',
                  width: '100%',
                  playerVars: {
                    autoplay: 0,
                    modestbranding: 1,
                    rel: 0,
                  },
                }}
                style={{ 
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            </Box>
            
            <VStack align="start" p={4} spacing={3}>
              <Text 
                fontWeight="semibold" 
                color="gray.800"
                fontSize="sm"
                lineHeight="1.4"
                noOfLines={2}
              >
                {video.title}
              </Text>
              
              <HStack spacing={2} wrap="wrap">
                <Badge colorScheme="orange" fontSize="xs">
                  {video.channelTitle}
                </Badge>
              </HStack>
              
              {video.description && (
                <Text 
                  fontSize="xs" 
                  color="gray.600"
                  noOfLines={2}
                  lineHeight="1.3"
                >
                  {video.description}
                </Text>
              )}
              
              {onUseVideoTutorial && (
                <Button
                  size="sm"
                  colorScheme="orange"
                  variant={activeVideoEnhancement === video.videoId ? "solid" : "outline"}
                  isLoading={videoEnhancementLoading === video.videoId}
                  loadingText="Analyzing..."
                  onClick={() => onUseVideoTutorial(video)}
                  width="full"
                  mt={2}
                >
                  {activeVideoEnhancement === video.videoId ? "Tutorial Applied" : "Use Tutorial"}
                </Button>
              )}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default YouTubeRegularVideosOnly;