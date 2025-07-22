// RecipeStep renders one instruction.
// If step includes timeMinutes, display a timer and allow user to start/stop/reset countdown.
import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  CircularProgress,
  CircularProgressLabel,
  useToast
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaRedo, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function RecipeStep({ step, stepNumber, isActive }) {
  const [timeLeft, setTimeLeft] = useState(step.timeMinutes ? step.timeMinutes * 60 : 0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const toast = useToast();

  const totalSeconds = step.timeMinutes ? step.timeMinutes * 60 : 0;

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && hasStarted) {
      setIsRunning(false);
      // Timer finished
      toast({
        title: 'Timer Complete!',
        description: `Step ${stepNumber} timer has finished`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, stepNumber, hasStarted, toast]);

  const startTimer = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
    setHasStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressValue = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: stepNumber * 0.1 }}
      p={4}
      borderWidth={2}
      borderColor={isActive ? 'blue.500' : 'gray.200'}
      borderRadius="lg"
      bg={isActive ? 'blue.50' : 'white'}
      boxShadow={isActive ? 'md' : 'sm'}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between" align="center">
          <HStack>
            <Badge 
              colorScheme={isActive ? 'blue' : 'gray'} 
              fontSize="sm" 
              px={2} 
              py={1}
              borderRadius="full"
            >
              Step {stepNumber}
            </Badge>
            {step.timeMinutes && (
              <Badge 
                colorScheme="orange" 
                leftIcon={<FaClock />}
                fontSize="sm"
                px={2}
                py={1}
                borderRadius="full"
              >
                {step.timeMinutes} min
              </Badge>
            )}
          </HStack>
        </HStack>

        <Text fontSize="md" lineHeight="1.6">
          {step.description}
        </Text>

        {step.timeMinutes && (
          <Box
            p={4}
            bg="gray.50"
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
          >
            <VStack spacing={3}>
              <HStack justify="center" spacing={4}>
                <CircularProgress
                  value={progressValue}
                  size="80px"
                  color={timeLeft === 0 ? 'green.400' : 'blue.400'}
                  thickness="8px"
                >
                  <CircularProgressLabel fontSize="sm" fontWeight="bold">
                    {formatTime(timeLeft)}
                  </CircularProgressLabel>
                </CircularProgress>
                
                <VStack spacing={2}>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Timer for this step
                  </Text>
                  
                  <HStack spacing={2}>
                    {!isRunning ? (
                      <Button
                        size="sm"
                        colorScheme="green"
                        leftIcon={<FaPlay />}
                        onClick={startTimer}
                        isDisabled={timeLeft === 0 && hasStarted}
                      >
                        {hasStarted ? 'Resume' : 'Start'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        colorScheme="orange"
                        leftIcon={<FaPause />}
                        onClick={pauseTimer}
                      >
                        Pause
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<FaRedo />}
                      onClick={resetTimer}
                    >
                      Reset
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
              
              {timeLeft === 0 && hasStarted && (
                <Text fontSize="sm" color="green.600" fontWeight="bold">
                  Timer Complete!
                </Text>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
    </MotionBox>
  );
}
