// This file initializes Firebase Admin SDK for backend operations
// Handles authentication with Firebase services like Firestore
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin SDK with service account credentials
let serviceAccount;

console.log('Environment variables loaded:');
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('Current working directory:', process.cwd());
console.log('File path resolved:', path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS || ''));

// Check if we have a service account JSON file path
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    // Option 1: Use service account JSON file (recommended)
    const serviceAccountPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('Trying to load service account from:', serviceAccountPath);
    serviceAccount = require(serviceAccountPath);
    console.log('Service account loaded successfully. Project ID:', serviceAccount.project_id);
  } catch (error) {
    console.error('Error loading service account file:', error.message);
    throw error;
  }
} else {
  console.log('Using individual environment variables for Firebase config');
  // Option 2: Use individual environment variables
  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
}

// Initialize the Firebase Admin app
if (!admin.apps.length) {
  console.log('Initializing Firebase Admin with project ID:', serviceAccount.project_id);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
  console.log('Firebase Admin initialized successfully!');
}

// Export Firestore database instance
const db = admin.firestore();

module.exports = { admin, db };
