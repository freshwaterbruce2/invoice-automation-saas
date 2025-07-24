#!/bin/bash

echo "🚀 Opening GitHub Setup Pages"
echo "============================="
echo ""
echo "This script will open the necessary GitHub pages in your browser."
echo "Follow these steps:"
echo ""
echo "1. First, create the repository on GitHub"
echo "2. Then create a personal access token"
echo "3. Use the token to push your code"
echo ""
echo "Press Enter to continue..."
read

# Try different methods to open URLs
open_url() {
    if command -v xdg-open > /dev/null; then
        xdg-open "$1"
    elif command -v open > /dev/null; then
        open "$1"
    elif command -v start > /dev/null; then
        start "$1"
    else
        echo "Please open this URL manually: $1"
    fi
}

echo "📂 Opening GitHub new repository page..."
echo "   - Repository name: invoice-automation-saas"
echo "   - Description: Modern invoice automation platform - get paid 3x faster"
echo "   - Make it Public"
echo "   - DO NOT initialize with README"
echo ""
open_url "https://github.com/new"

echo ""
echo "Press Enter after creating the repository..."
read

echo "🔑 Opening GitHub token creation page..."
echo "   - Token name: Invoice SaaS Deploy"
echo "   - Select scope: ✅ repo"
echo "   - Click 'Generate token'"
echo "   - COPY THE TOKEN!"
echo ""
open_url "https://github.com/settings/tokens/new"

echo ""
echo "Once you have your token, run this command:"
echo ""
echo "git remote set-url origin https://YOUR_TOKEN@github.com/freshwaterbruce2/invoice-automation-saas.git"
echo "git push -u origin main"
echo ""
echo "Replace YOUR_TOKEN with the token you just copied!"