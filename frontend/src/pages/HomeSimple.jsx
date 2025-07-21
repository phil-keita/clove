import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const HomeSimple = () => {
  return (
    <Box p={8}>
      <Heading size="xl" mb={4}>
        Welcome to Clove Recipe App! 🍳
      </Heading>
      <Text fontSize="lg">
        This is a simplified version to test if the app is working.
      </Text>
    </Box>
  );
};

export default HomeSimple;
