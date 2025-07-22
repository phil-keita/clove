# Clove - Recipe Learning App

A React web application that helps users learn how to cook with AI-generated recipes, step-by-step guides, and integrated YouTube videos.

## Features

- **Recipe Search**: AI-powered recipe generation using OpenAI GPT-3.5 Turbo
- **Step-by-step Guides**: Interactive cooking instructions with timers
- **YouTube Integration**: Watch cooking videos alongside recipes
- **Recipe Management**: Like, save, and organize favorite recipes
- **User Accounts**: Firebase authentication with profile management
- **Responsive Design**: Beautiful UI with Chakra UI and Framer Motion animations
- **Popular Recipes**: Discover trending recipes from the community

## Tech Stack

### Frontend
- React 19.1.0 with Vite 5.4.19
- Chakra UI for components and styling
- Framer Motion for animations
- React Router DOM for navigation
- Firebase SDK for authentication
- Axios for API calls
- React YouTube for video integration
- React Icons for iconography

### Backend
- Node.js with Express 4.21.2
- Firebase Admin SDK for server-side Firebase operations
- OpenAI 5.10.1 API for recipe generation
- YouTube Data API v3 for video tutorials
- Firestore for data storage
- Axios for HTTP requests
- CORS for cross-origin requests
- dotenv for environment variable management

## Quick Start

### Prerequisites
- Node.js (v22.17.1 or higher recommended - LTS version)
- Firebase project 
- OpenAI API key
- YouTube Data API key (optional for video tutorials)

### Quick Setup

1. **Clone and Install Dependencies**
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

2. **Run Setup Script**
```bash
./setup.sh
```

3. **Get API Keys & Credentials**
   - **Firebase**: Create project, enable auth, get web config & service account
   - **OpenAI**: Get API key from platform.openai.com
   - **YouTube**: Get YouTube Data API v3 key from Google Cloud Console (optional)
   - **Detailed instructions**: See `SETUP_GUIDE.md` and `YOUTUBE_SETUP.md`

4. **Configure Environment Variables**
```bash
# Edit these files with your actual credentials:
# frontend/.env - Firebase web config
# backend/.env - OpenAI API key & Firebase service account
```

5. **Run the Application**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

**App available at**: `http://localhost:5173`

## Project Structure

```
clove/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── api.js          # Main API routes
│   │   ├── firebase.js     # Firebase Admin setup
│   │   ├── llm.js          # OpenAI integration
│   │   └── utils.js        # Utility functions
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   └── services/       # API services
│   └── package.json
└── README.md
```

## Available Scripts

### Backend
- `npm start` - Run production server
- `npm run dev` - Run development server with nodemon

### Frontend
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code analysis

## API Endpoints

- `POST /api/recipe/generate` - Generate recipe from description
- `POST /api/recipe/suggestions` - Get AI-powered recipe suggestions
- `GET /api/recipe/:recipeId` - Get specific recipe by ID
- `GET /api/recipe/:recipeId/videos` - Get YouTube videos for recipe
- `POST /api/recipe/:recipeId/analyze-video` - Analyze video tutorial for recipe enhancement
- `GET /api/recipes/popular` - Get popular recipes
- `GET /api/user/liked-recipes` - Get user's liked recipes
- `POST /api/recipe/like` - Like/unlike a recipe
- `GET /api/health` - API health check

## Current Status

### Working Without API Keys
The frontend is fully functional and you can explore the UI:
- **Home page** with beautiful design
- **Navigation** and routing between pages
- **Authentication UI** (login/signup forms)
- **Recipe search interface**
- **Step-by-step cooking guide** UI
- **Profile and liked recipes** pages
- **Responsive design** and animations

### Requires API Keys for Full Functionality
- **Recipe generation** (needs OpenAI API key)
- **User authentication** (needs Firebase config)
- **Recipe saving/liking** (needs Firebase + authentication)
- **Popular recipes** (needs Firebase database)

### Development Mode
Currently running at `http://localhost:5173` with:
- Hot module replacement
- Error overlay
- Development tools

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email [your-email] or create an issue in the repository.
project for clove cooking app.
