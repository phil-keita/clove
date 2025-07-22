# 🔑 API Keys & Credentials Setup Guide

This guide will walk you through setting up all the required API keys and credentials for the Clove Recipe App.

## 📋 **Prerequisites**

- [ ] Google/Gmail account (for Firebase and YouTube API)
- [ ] OpenAI account (for recipe generation)
- [ ] Basic understanding of environment variables

## 🔥 **1. Firebase Setup**

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `clove-recipe-app` (or your preferred name)
4. Disable Google Analytics (optional for this app)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the sidebar
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** provider
5. Enable **Google** provider (optional but recommended)
6. Save the configuration

### Step 3: Create Firestore Database

1. Go to **Firestore Database** in the sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Step 4: Get Web App Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Enter app nickname: `clove-frontend`
5. Don't check "Firebase Hosting" for now
6. Click "Register app"
7. **Copy the config object** - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDOCAbC123dEf456GhI789jKl01MnO2PqR",
  authDomain: "clove-recipe-app.firebaseapp.com",
  projectId: "clove-recipe-app",
  storageBucket: "clove-recipe-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};
```

### Step 5: Generate Service Account Key (for Backend)

1. Go to **Project Settings** → **Service accounts** tab
2. Click "Generate new private key"
3. Click "Generate key" - this downloads a JSON file
4. **Save this file securely** - you'll need it for the backend

## 🤖 **2. OpenAI Setup**

### Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to [API Keys](https://platform.openai.com/api-keys)

### Step 2: Generate API Key

1. Click "Create new secret key"
2. Give it a name: `clove-recipe-app`
3. **Copy and save the key** - you won't see it again!
4. The key looks like: `sk-proj-abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx`

### Step 3: Add Billing (if needed)

- OpenAI requires billing info for API usage
- Go to [Billing](https://platform.openai.com/account/billing)
- Add payment method
- Set usage limits for safety

## ⚙️ **3. YouTube Data API Setup**

### Step 1: Enable YouTube Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (or create a new one)
3. Navigate to **APIs & Services** > **Library**
4. Search for "YouTube Data API v3"
5. Click on it and press **Enable**

### Step 2: Create API Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated API key
4. (Optional) Click on the key to restrict it:
   - **Application restrictions**: None (or HTTP referrers for production)
   - **API restrictions**: Restrict key to "YouTube Data API v3"
5. Save the restrictions

### Step 3: Verify Setup

- Test the API key by making a request:
  ```bash
  curl "https://www.googleapis.com/youtube/v3/search?part=snippet&q=pasta+recipe&type=video&maxResults=3&key=YOUR_API_KEY"
  ```

## ⚙️ **4. Configure Environment Variables**

### Frontend Configuration

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` file and replace the values:
   ```bash
   VITE_API_BASE_URL=http://localhost:3001
   
   # Use the values from your Firebase web config
   VITE_FIREBASE_API_KEY=AIzaSyDOCAbC123dEf456GhI789jKl01MnO2PqR
   VITE_FIREBASE_AUTH_DOMAIN=clove-recipe-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=clove-recipe-app
   VITE_FIREBASE_STORAGE_BUCKET=clove-recipe-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789jkl
   ```

### Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env
   ```

3. Place your Firebase service account JSON file in the backend directory:
   ```bash
   # Name it something like: serviceAccountKey.json
   ```

4. Edit `.env` file:
   ```bash
   PORT=3001
   NODE_ENV=development
   
   # Your OpenAI API key
   OPENAI_API_KEY=sk-proj-abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
   
   # Your YouTube Data API key
   YOUTUBE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
   
   # Path to your service account JSON file
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   
   # Firebase project ID (from your config)
   FIREBASE_PROJECT_ID=clove-recipe-app
   
   CORS_ORIGIN=http://localhost:5173
   ```

## 🚀 **5. Test the Setup**

### Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 3001
Firebase Admin initialized successfully
```

### Start the Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` - the app should load without errors.

### Test Authentication

1. Click "Sign In" 
2. Try creating an account
3. Check Firebase Console → Authentication → Users

### Test Recipe Generation

1. Search for a recipe (e.g., "chocolate chip cookies")
2. Check the browser console for any errors
3. The recipe should appear with AI-generated content

## 🔒 **Security Notes**

### ✅ **Safe to commit:**
- `.env.example` files
- Frontend environment variables (these are public in web apps)

### ❌ **Never commit:**
- `.env` files
- Service account JSON files
- OpenAI API keys
- Any files containing secrets

### 📁 **Add to .gitignore:**
```
# Environment variables
.env
.env.local
.env.production

# Firebase
serviceAccountKey.json
firebase-service-account.json

# Logs
*.log
```

## 🐛 **Troubleshooting**

### Common Issues:

1. **"Firebase Admin not initialized"**
   - Check your service account JSON path
   - Verify the JSON file is valid

2. **"OpenAI API rate limit"**
   - Check your OpenAI billing settings
   - Verify your API key is correct

3. **"CORS errors"**
   - Make sure backend is running on port 3001
   - Check CORS_ORIGIN in backend .env

4. **"Firebase Auth errors"**
   - Verify your Firebase web config
   - Check that Authentication is enabled

## 💰 **Cost Estimates**

### Firebase (Free tier includes):
- Authentication: 50,000 MAU
- Firestore: 50,000 reads/day
- **Cost: FREE for development**

### OpenAI:
- GPT-3.5 Turbo: ~$0.002 per recipe generation
- **Cost: ~$1-5/month for testing**

## ✅ **Verification Checklist**

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Firebase web config copied to frontend .env
- [ ] Service account key downloaded and placed in backend
- [ ] OpenAI API key obtained and added to backend .env
- [ ] Backend starts without errors
- [ ] Frontend loads without errors
- [ ] Can create user account
- [ ] Can generate a recipe

---

Once you've completed these steps, your Clove Recipe App will be fully functional with AI-powered recipe generation and user authentication! 🎉
