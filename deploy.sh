#!/bin/bash

# InvoiceFlow Deployment Script
# This script prepares and deploys the application to Vercel

echo "🚀 Starting InvoiceFlow deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it with: npm i -g vercel"
    exit 1
fi

# Check if environment variables are set
if [ ! -f .env.production.local ]; then
    echo "⚠️  Warning: .env.production.local not found"
    echo "Make sure to set the following environment variables in Vercel:"
    echo "- VITE_STRIPE_PUBLIC_KEY"
    echo "- VITE_SUPABASE_URL"
    echo "- VITE_SUPABASE_ANON_KEY"
    echo "- VITE_SENTRY_DSN"
fi

# Run tests
echo "🧪 Running tests..."
npm test -- --run
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix them before deploying."
    exit 1
fi

# Run linting
echo "🔍 Running linter..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix errors before deploying."
    exit 1
fi

# Build the application
echo "🔨 Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors."
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
if [ "$1" == "production" ]; then
    echo "Deploying to production..."
    vercel --prod
else
    echo "Deploying preview..."
    vercel
fi

echo "✅ Deployment complete!"