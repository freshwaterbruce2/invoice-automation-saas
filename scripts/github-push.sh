#!/bin/bash

# GitHub Push Automation Script
# This script simplifies pushing to GitHub

echo "🚀 GitHub Push Automation for Invoice Automation SaaS"
echo "======================================================"
echo ""
echo "GitHub username: freshwaterbruce2"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git is not initialized in this directory"
    exit 1
fi

# Check current remotes
echo "📍 Current remotes:"
git remote -v
echo ""

# Check if origin exists
if git remote | grep -q '^origin$'; then
    echo "✅ Remote 'origin' already exists"
else
    echo "➕ Adding GitHub remote..."
    git remote add origin https://github.com/freshwaterbruce2/invoice-automation-saas.git
    echo "✅ Remote added"
fi

echo ""
echo "📋 Current status:"
git status --short
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes. Commit them first!"
    exit 1
fi

echo "🔄 Pushing to GitHub..."
echo ""

# Try to push
if git push -u origin main 2>&1 | tee /tmp/git-push-output.txt; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Your repository is now available at:"
    echo "   https://github.com/freshwaterbruce2/invoice-automation-saas"
else
    echo ""
    echo "❌ Push failed. Common solutions:"
    echo ""
    echo "1. If the repository doesn't exist on GitHub:"
    echo "   - Go to https://github.com/new"
    echo "   - Create a new repository named 'invoice-automation-saas'"
    echo "   - DO NOT initialize with README"
    echo ""
    echo "2. If authentication failed:"
    echo "   - Create a personal access token at:"
    echo "     https://github.com/settings/tokens/new"
    echo "   - Select 'repo' scope"
    echo "   - Run: git remote set-url origin https://YOUR_TOKEN@github.com/freshwaterbruce2/invoice-automation-saas.git"
    echo ""
    echo "3. If the repository exists but has different history:"
    echo "   - Run: git push -u origin main --force"
    echo "   - WARNING: This will overwrite the remote repository"
    echo ""
    
    # Check if it's an auth error
    if grep -q "Authentication failed" /tmp/git-push-output.txt; then
        echo "🔐 Authentication issue detected!"
        echo "   Please set up authentication using one of the methods above."
    fi
fi

echo ""
echo "📝 Next steps after successful push:"
echo "   1. Connect to Vercel: https://vercel.com/new"
echo "   2. Import your GitHub repository"
echo "   3. Configure environment variables"
echo "   4. Deploy!"