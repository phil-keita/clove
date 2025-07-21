import React, { useContext } from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useColorModeValue,
  useColorMode,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { AuthContext } from '../../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box bg={bg} borderBottom="1px" borderColor={borderColor} px={4} position="sticky" top={0} zIndex={1000}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <RouterLink to="/">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, orange.400, pink.400)"
            bgClip="text"
          >
            Clove 🍳
          </Text>
        </RouterLink>

        {/* Desktop Navigation */}
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <Button as={RouterLink} to="/" variant="ghost">
            Home
          </Button>
          <Button as={RouterLink} to="/popular" variant="ghost">
            Popular
          </Button>
          {user && (
            <Button as={RouterLink} to="/liked" variant="ghost">
              My Recipes
            </Button>
          )}
        </HStack>

        {/* Right Side */}
        <HStack spacing={4}>
          {/* Color Mode Toggle */}
          <IconButton
            size="sm"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
          />

          {/* User Menu or Auth Button */}
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="ghost"
                cursor="pointer"
                minW={0}
              >
                <HStack>
                  <Avatar size="sm" src={user.photoURL} name={user.displayName || user.email} />
                  <Text display={{ base: 'none', md: 'block' }}>
                    {user.displayName || user.email?.split('@')[0]}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => navigate('/liked')}>
                  Liked Recipes
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              as={RouterLink}
              to="/auth"
              colorScheme="orange"
              variant="solid"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<HamburgerIcon />}
              variant="ghost"
              display={{ base: 'flex', md: 'none' }}
              aria-label="Open menu"
            />
            <MenuList>
              <MenuItem onClick={() => navigate('/')}>
                Home
              </MenuItem>
              <MenuItem onClick={() => navigate('/popular')}>
                Popular
              </MenuItem>
              {user && (
                <MenuItem onClick={() => navigate('/liked')}>
                  My Recipes
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigation;
