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
  Grid,
} from '@chakra-ui/react';
import YouTube from 'react-youtube';
import { apiService } from '../../services/api';

const YouTubeShortsOnly = ({ recipeId, recipeName, onUseVideoTutorial, activeVideoEnhancement, videoEnhancementLoading }) => {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShorts = async () => {
      if (!recipeId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getRecipeVideos(recipeId);
        console.log('Shorts API response:', response);
        setShorts(response.shorts || []);
        
      } catch (error) {
        console.error('Error fetching shorts:', error);
        setError('Failed to load recipe shorts');
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, [recipeId]);

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="purple.500" />
        <Text mt={4} color="gray.600">Loading recipe shorts...</Text>
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

  if (shorts.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.600">No shorts found for this recipe.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={6} color="purple.700">
        Recipe Shorts
      </Heading>
      
      <HStack spacing={6} align="start" overflowX="auto" pb={2}>
        {shorts.map((short) => (
          <Box 
            key={short.videoId}
            bg="white" 
            borderRadius="lg" 
            overflow="hidden"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            transition="transform 0.2s"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            minW="280px"
            flexShrink={0}
          >
            <Box 
              position="relative"
              bg="purple.50"
              w="100%"
              h="315px" // 16:9 aspect ratio height for better card filling
              overflow="hidden"
            >
              <YouTube 
                videoId={short.videoId} 
                opts={{
                  height: '315',
                  width: '280',
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
                minH="2.8em" // Ensures consistent height across cards
              >
                {short.title}
              </Text>
              
              <HStack spacing={2} wrap="wrap">
                <Badge colorScheme="orange" fontSize="xs">
                  {short.channelTitle}
                </Badge>
              </HStack>
              
              {short.description && (
                <Text 
                  fontSize="xs" 
                  color="gray.600"
                  noOfLines={2}
                  lineHeight="1.3"
                >
                  {short.description}
                </Text>
              )}
              
              {onUseVideoTutorial && (
                <Button
                  size="sm"
                  colorScheme="orange"
                  variant={activeVideoEnhancement === short.videoId ? "solid" : "outline"}
                  isLoading={videoEnhancementLoading === short.videoId}
                  loadingText="Analyzing..."
                  onClick={() => onUseVideoTutorial(short)}
                  width="full"
                  mt={2}
                >
                  {activeVideoEnhancement === short.videoId ? "Tutorial Applied" : "Use Tutorial"}
                </Button>
              )}
            </VStack>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default YouTubeShortsOnly;