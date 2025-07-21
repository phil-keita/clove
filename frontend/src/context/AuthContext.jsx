// AuthContext provides user authentication state and functions throughout the app
// Manages login, logout, and user session persistence
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export { AuthContext };

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign up with email and password
  const signup = async (email, password) => {
    if (!auth) {
      throw new Error('Authentication not available');
    }
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    if (!auth) {
      throw new Error('Authentication not available');
    }
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    if (!auth) {
      throw new Error('Authentication not available');
    }
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    if (!auth) {
      localStorage.removeItem('authToken');
      return;
    }
    try {
      setError(null);
      await signOut(auth);
      localStorage.removeItem('authToken');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    let unsubscribe;
    
    if (!auth) {
      console.warn('Firebase auth not available');
      setLoading(false);
      setError('Firebase authentication not available. Running in demo mode.');
      return;
    }
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        setLoading(false);
        
        if (user) {
          // Get and store the auth token
          try {
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);
          } catch (error) {
            console.error('Error getting auth token:', error);
          }
        } else {
          localStorage.removeItem('authToken');
        }
      });
    } catch (error) {
      console.error('Firebase auth initialization error:', error);
      setError('Firebase authentication not available. Some features may not work.');
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    user: currentUser,
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
