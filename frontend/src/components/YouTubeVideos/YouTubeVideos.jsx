import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Grid,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import YouTube from 'react-youtube';
import { api } from '../../services/api';

const YouTubeVideos = ({ recipeId, recipeName }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!recipeId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/recipe/${recipeId}/videos`);
        setVideos(response.data.videos || []);
        
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load recipe videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [recipeId]);

  const youtubeOpts = {
    height: '200',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

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
      <Alert status="warning" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.600">No videos found for this recipe</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={6} color="green.700">
        Recipe Video Tutorials
      </Heading>
      
      <Grid 
        templateColumns={{ base: '1fr', md: 'repeat(auto-fit, minmax(320px, 1fr))' }}
        gap={6}
      >
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
            <Box position="relative">
              <YouTube 
                videoId={video.videoId} 
                opts={youtubeOpts}
                style={{ width: '100%' }}
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
              
              <HStack spacing={2}>
                <Badge colorScheme="green" fontSize="xs">
                  {video.channelTitle}
                </Badge>
              </HStack>
              
              {video.description && (
                <Text 
                  fontSize="xs" 
                  color="gray.600"
                  noOfLines={3}
                  lineHeight="1.3"
                >
                  {video.description}
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default YouTubeVideos;
