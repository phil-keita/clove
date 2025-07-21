**detailed and explicit project structure/instructions**
---

# 🏗️ Project Structure & Instructions for Copilot

---

## **Goal**

Build a web application with:
- A React frontend for users to search, view, and interact with recipes
- A Node.js/Express backend API to fetch/generated recipes using OpenAI GPT-3.5 Turbo, interact with Firebase (Firestore, Auth)
- Both projects live in a single repo, in different folders.

---

## **Root Folder Structure**

```
/your-recipe-app
  /frontend    # React application (user-facing)
  /backend     # Express.js API (for LLM, Firestore use, backend business logic)
  README.md    # Main instructions
  .gitignore   # Ignore node_modules, env files, etc.
```

---

## **Step-by-Step Instructions for Copilot**

### **1. Project Initialization**

- In root folder, create:
  - `/frontend` for the React app
  - `/backend` for the API app

#### **Frontend Setup (`/frontend`)**
- Use Vite or Create React App (`npx create-react-app frontend` or `npm create vite@latest frontend -- --template react`)
- Install dependencies:
  - UI: Material-UI or Chakra UI (`npm i @mui/material @emotion/react @emotion/styled`) or Chakra
  - Routing: `react-router-dom`
  - Animations: `framer-motion`
  - Auth: `firebase`
  - HTTP: `axios`
  - YouTube embed: `react-youtube`

#### **Backend Setup (`/backend`)**
- Initialize (`npm init -y`)
- Install dependencies:
  - Main: `express`, `cors`, `dotenv`, `firebase-admin`
  - LLM: `openai`
  - Dev: `nodemon`

---

### **2. Environment Variables**

- `.env` file at `/backend` with:
  - `OPENAI_API_KEY=...`
  - `FIREBASE_PROJECT_ID=...`
  - `FIREBASE_CLIENT_EMAIL=...`
  - `FIREBASE_PRIVATE_KEY=...`

- In `/frontend`, use `.env` for Firebase web config.

---

### **3. File Structure Example**

```
/your-recipe-app
  /frontend
    /src
      /components
        Auth/
        RecipeSearch/
        RecipeSteps/
        RecipeLike/
      /pages
        Home.js
        Profile.js
        RecipeDetail.js
      App.js
      main.jsx (if Vite)
      index.js (if CRA)
    .env
    package.json
  /backend
    /src
      api.js        # Express app and routes
      llm.js        # Logic for calling OpenAI
      firebase.js   # Firestore/Firebase admin init
      utils.js      # Misc utilities (caching, parsing)
    .env
    package.json
  .gitignore
  README.md
```

---

### **4. Copilot-Focused Instructions**

**README.md** (write clearly for Copilot to use as context):

```
# AI-Powered Recipe App Monorepo

## Structure
- /frontend: React app (UI, user interaction)
- /backend: Node.js/Express API server (handles LLM calls, Firestore)

## How it works
- The frontend sends recipe requests, user actions (like, favorite) to backend API endpoints.
- The backend authenticates the user with Firebase, checks for cached recipe in Firestore, or generates new one using OpenAI GPT-3.5 Turbo if needed. Backend also handles "like" logic and interacts with Firestore to store user/recipe/like data.

## Setup

### 1. Backend
- Install: `cd backend && npm install`
- Create `.env` (see above for required vars)
- Run: `npm run dev` (use nodemon)

### 2. Frontend
- Install: `cd frontend && npm install`
- Create `.env` (see above)
- Run: `npm start` or `npm run dev`

### 3. Workflow

User Flow:
1. User logs in or signs up (Firebase Auth on frontend)
2. User searches for a recipe (text input)
3. Frontend POSTs `/api/recipe/generate` with recipe name
4. Backend checks Firestore for cached recipe
5. If not cached, backend calls OpenAI API to generate recipe (ingredients, steps, timed steps in JSON)
6. Backend searches YouTube for a cooking video (optional)
7. Backend saves result in Firestore, responds to frontend
8. Frontend displays step-by-step guide with timer component where needed
9. User can "like" recipe → saved to Firestore for their profile and for global count

### 4. API Endpoints (for Copilot)
- POST `/api/recipe/generate` : `{ recipeName }`
  - Response: `{ ingredients, steps, maybe video, difficulty, etc }`
- POST `/api/recipe/like` : `{ recipeId }` (must be authenticated)
- GET `/api/recipe/:recipeId` : Get a recipe by cached ID

### 5. Firebase Schema

- `/users/{uid}` :
  - profile info
  - likedRecipes: Array or subcollection of recipe references

- `/recipes/{recipeId}` :
  - recipeName, ingredients, steps, createdAt, likes counter, lastSearched

### 6. LLM Prompt Format

"Return the recipe for [RECIPE_NAME] with these fields in JSON:  
- ingredients (array of { name, quantity, unit }),  
- steps (array of { description, timeMinutes (optional) }),  
- difficulty (string),  
- estimatedTime (minutes).  
Highlight steps with 'timeMinutes' for cooking/waiting steps."

---

## Development Notes
- Use React Context or Zustand for app-wide state (user session, liked/favorited recipes)
- Use React Router for page navigation
- Use Framer Motion for animated step transitions in recipe guide
- Use Axios on frontend to call backend
- Parse and display backend JSON strictly (validate structure in frontend)
```

---

### **5. Code Comments & Copilot Context**

*Add clear comments in starter files:*

- In `/backend/src/api.js`:  
  ```js
  // This Express API has routes to generate recipes using OpenAI, manage likes, and return data from Firestore. 
  // All business logic for recipe lookup, caching, and LLM calls happen here.
  ```
- In `/frontend/src/components/RecipeSteps/RecipeStep.js`:  
  ```js
  // RecipeStep renders one instruction. 
  // If step includes timeMinutes, display a timer and allow user to start/stop/reset countdown.
  ```
- In `/frontend/src/components/Auth/`:  
  ```js
  // SignUp and Login use Firebase Auth functions. 
  // On auth state change, save user to context/global state.
  ```

---

### **6. What to Tell Copilot In Each Directory**

- `/frontend`
  - Scaffold pages: Home (search & list recipes), Recipe Detail (show steps, guide), Profile (show user info, liked/saved recipes)
  - Components: RecipeSearch, RecipeSteps (multi-step flow, uses timer), RecipeLike, AuthForm
  - Use `firebase` from npm for auth

- `/backend`
  - Express routes as per above
  - Connect to Firestore using admin SDK (service account, never expose on frontend)
  - LLM logic in `llm.js` (calls to OpenAI with error handling, parses JSON)
  - Caching logic in `utils.js`
  - Like logic: increments count in recipes, writes to user profile

---

## **Final Tips for Copilot Success**

- Be explicit in comments about intended data structures and APIs.
- Write clear sample inputs/outputs for LLM in your prompt files or comments.
- Incrementally write and run—correct generation as needed.

---
