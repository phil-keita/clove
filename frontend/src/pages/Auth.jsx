import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import AuthForm from '../components/Auth/AuthForm';

const MotionBox = motion(Box);

const Auth = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Button
              variant="ghost"
              colorScheme="orange"
              onClick={() => navigate('/')}
              mb={4}
              alignSelf="flex-start"
            >
              ← Back to Home
            </Button>
            
            <Heading
              size="2xl"
              bgGradient="linear(to-r, orange.400, pink.400)"
              bgClip="text"
              mb={4}
            >
              Welcome to Clove
            </Heading>
            
            <Text fontSize="lg" color="gray.600" mb={2}>
              Join our community of home chefs and discover amazing recipes
            </Text>
          </MotionBox>

          {/* Auth Form */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AuthForm />
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default Auth;
