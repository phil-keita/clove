import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation/Navigation';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RecipeDetail from './pages/RecipeDetail';
import CookingGuide from './pages/CookingGuide';
import Profile from './pages/Profile';
import LikedRecipes from './pages/LikedRecipes';
import PopularRecipes from './pages/PopularRecipes';

function App() {
  return (
    <ChakraProvider>
      <ErrorBoundary>
        <AuthProvider>
          <RecipeProvider>
            <Router>
              <Box minH="100vh">
                <Navigation />
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    <Route path="/recipe/:id/guide" element={<CookingGuide />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/liked" element={<LikedRecipes />} />
                    <Route path="/popular" element={<PopularRecipes />} />
                  </Routes>
                </ErrorBoundary>
              </Box>
            </Router>
          </RecipeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default App;
