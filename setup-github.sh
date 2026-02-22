#!/bin/bash

echo "=== enx-blue GitHub Setup Script ==="
echo ""
echo "This script will help you push your code to GitHub"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   https://git-scm.com/downloads"
    exit 1
fi

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git branch -m main
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "Initial commit: enx-blue habit tracker"

echo ""
echo "✅ Repository ready!"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named 'enx-blue'"
echo "3. Run the following commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/enx-blue.git"
echo "   git push -u origin main"
echo ""
echo "Replace YOUR_USERNAME with your GitHub username"
