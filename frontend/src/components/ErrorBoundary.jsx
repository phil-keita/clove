import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8} textAlign="center">
          <VStack spacing={4}>
            <Heading size="lg" color="red.500">
              🍳 Something went wrong!
            </Heading>
            <Text>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Text>
            <Button colorScheme="blue" onClick={this.handleReset}>
              Try Again
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box mt={4} p={4} bg="gray.100" borderRadius="md" textAlign="left" fontSize="sm">
                <Text fontWeight="bold">Error Details:</Text>
                <Text color="red.600">{this.state.error.toString()}</Text>
                <Text mt={2} color="gray.600">
                  {this.state.errorInfo.componentStack}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
