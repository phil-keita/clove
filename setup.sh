#!/bin/bash

# Clove Recipe App - Quick Setup Script
# This script helps you set up the environment files

echo "🍳 Welcome to Clove Recipe App Setup!"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the root directory of the Clove project"
    exit 1
fi

echo "📁 Setting up environment files..."

# Frontend setup
if [ ! -f "frontend/.env" ]; then
    echo "📱 Creating frontend/.env from template..."
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "⚠️  frontend/.env already exists"
fi

# Backend setup
if [ ! -f "backend/.env" ]; then
    echo "🔧 Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists"
fi

echo ""
echo "🔑 API Keys & Credentials Needed:"
echo "================================="
echo ""
echo "1. 🔥 Firebase Setup:"
echo "   • Create project at: https://console.firebase.google.com/"
echo "   • Enable Authentication (Email/Password)"
echo "   • Create Firestore database"
echo "   • Get web config and service account key"
echo ""
echo "2. 🤖 OpenAI Setup:"
echo "   • Get API key from: https://platform.openai.com/api-keys"
echo ""
echo "📚 For detailed instructions, see: SETUP_GUIDE.md"
echo ""
echo "📝 Next steps:"
echo "   1. Edit frontend/.env with your Firebase web config"
echo "   2. Edit backend/.env with your OpenAI API key"
echo "   3. Place Firebase service account JSON in backend/"
echo "   4. Run: cd backend && npm run dev"
echo "   5. Run: cd frontend && npm run dev"
echo ""
echo "🎉 Happy cooking!"
