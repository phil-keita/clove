#!/bin/bash

# Clove Recipe App - Quick Setup Script
# This script helps you set up the environment files and checks prerequisites

echo "Clove Recipe App Setup"
echo "======================"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "Node.js version: $NODE_VERSION"
    
    # Extract major version number
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo "Warning: Node.js v18+ recommended (you have $NODE_VERSION)"
        echo "   Consider updating to Node.js v22.17.1 (LTS)"
    else
        echo "Node.js version is compatible"
    fi
else
    echo "Node.js not found. Please install Node.js v22.17.1 or higher"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "Please run this script from the root directory of the Clove project"
    exit 1
fi

echo "Setting up environment files..."

# Frontend setup
if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env from template..."
    cp frontend/.env.example frontend/.env
    echo "Created frontend/.env"
else
    echo "frontend/.env already exists"
fi

# Backend setup
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "Created backend/.env"
else
    echo "backend/.env already exists"
fi

echo ""
echo "API Keys & Credentials Needed:"
echo "=================================="
echo ""
echo "1. Firebase Setup:"
echo "   • Create project at: https://console.firebase.google.com/"
echo "   • Enable Authentication (Email/Password)"
echo "   • Create Firestore database"
echo "   • Get web config and service account key"
echo ""
echo "2. OpenAI Setup:"
echo "   • Get API key from: https://platform.openai.com/api-keys"
echo "   • Required for AI recipe generation"
echo ""
echo "3. YouTube API Setup (optional but recommended):"
echo "   • Enable YouTube Data API v3 in Google Cloud Console"
echo "   • Create API key and add to backend/.env"
echo "   • Enables video tutorials and AI video analysis"
echo "   • See YOUTUBE_SETUP.md for details"
echo ""
echo "For detailed instructions:"
echo "   • Setup Guide: SETUP_GUIDE.md"
echo "   • YouTube Guide: YOUTUBE_SETUP.md"
echo ""
echo "Next steps:"
echo "   1. Edit frontend/.env with your Firebase web config"
echo "   2. Edit backend/.env with your API keys:"
echo "      - OpenAI API key (required)"
echo "      - YouTube API key (optional)"
echo "   3. Place Firebase service account JSON in backend/"
echo "   4. Run: cd backend && npm start"
echo "   5. Run: cd frontend && npm run dev"
echo ""
echo "Setup complete! Check the guides above for API key configuration."
