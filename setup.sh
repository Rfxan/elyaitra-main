#!/bin/bash

# Elyaitra Hackathon Setup Script
# This script sets up the Elyaitra cybersecurity platform for evaluation

echo "🚀 Setting up Elyaitra Cybersecurity Platform"
echo "=============================================="

# Check if we're in the right directory
if [ ! -d "src/client" ] || [ ! -d "src/server" ]; then
    echo "❌ Error: Please run this script from the root directory of the Elyaitra project"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
cd src/client
npm install

echo "🐍 Setting up Python backend..."
cd ../server

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv .venv

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
python -c "from app.db.init_db import init_db; init_db()"

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the application:"
echo ""
echo "1. Frontend (in new terminal):"
echo "   cd src/client"
echo "   npm run dev"
echo ""
echo "2. Backend (in new terminal):"
echo "   cd src/server"
echo "   source .venv/bin/activate"
echo "   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/docs"
echo ""
echo "📝 Note: The system will work with mock AI responses if no API keys are configured."
echo "   For full AI functionality, add GROQ_API_KEY or GEMINI_API_KEY to .env file."