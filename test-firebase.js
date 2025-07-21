// Test Firebase Database Connection
// This script tests if your Firestore database is properly configured

import { db } from './frontend/src/services/firebase.js';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase Firestore connection...');
    
    // Test 1: Try to read from a collection
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('✅ Can read from Firestore');
    console.log('Existing test documents:', snapshot.size);
    
    // Test 2: Try to write a test document
    const testDoc = {
      message: 'Hello from Clove Recipe App!',
      timestamp: new Date(),
      test: true
    };
    
    const docRef = await addDoc(testCollection, testDoc);
    console.log('✅ Can write to Firestore');
    console.log('Test document created with ID:', docRef.id);
    
    // Test 3: Test recipes collection structure
    const recipesCollection = collection(db, 'recipes');
    const recipesSnapshot = await getDocs(recipesCollection);
    console.log('📚 Recipes collection has', recipesSnapshot.size, 'documents');
    
    return {
      success: true,
      message: 'Firebase Firestore is working correctly!',
      testDocId: docRef.id
    };
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// To run this test, call testFirebaseConnection() from your browser console
// or import it in your React component

console.log('Firebase test function loaded. Call testFirebaseConnection() to test.');
