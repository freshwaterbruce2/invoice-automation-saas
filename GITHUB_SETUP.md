# 🚀 Push to GitHub - Quick Setup

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository with these settings:
   - Repository name: `invoice-automation-saas`
   - Description: "Modern invoice automation platform - get paid 3x faster"
   - Public or Private (your choice)
   - DO NOT initialize with README, .gitignore, or license

## Step 2: Push Your Code

Run these commands in your terminal:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/invoice-automation-saas.git

# Push all branches and tags
git push -u origin main

# Verify push was successful
git remote -v
git log --oneline
```

## Step 3: Enable GitHub Pages (Optional)

If you want a demo site:
1. Go to Settings > Pages
2. Source: Deploy from branch
3. Branch: main
4. Folder: /dist
5. Save

## Step 4: Setup GitHub Actions

The CI/CD workflows are already configured in `.github/workflows/`:
- `ci.yml` - Runs tests and builds on every push
- `security.yml` - Security scanning
- No additional setup needed!

## Step 5: Add Repository Secrets

Go to Settings > Secrets and variables > Actions, add:
- `VERCEL_TOKEN` - For deployment
- `VERCEL_ORG_ID` - Your Vercel org ID
- `VERCEL_PROJECT_ID` - Created after first deploy
- `SENTRY_AUTH_TOKEN` - For source maps
- `SNYK_TOKEN` - For security scanning (optional)

## Quick Copy-Paste Commands

```bash
# If you haven't committed yet
git add -A
git commit -m "Initial commit: Invoice Automation SaaS"

# Set remote and push
git remote add origin https://github.com/YOUR_USERNAME/invoice-automation-saas.git
git branch -M main
git push -u origin main
```

## After Pushing

1. Your code is now on GitHub!
2. GitHub Actions will automatically run tests
3. You can now deploy to Vercel by connecting your GitHub repo
4. Share your repo: `https://github.com/YOUR_USERNAME/invoice-automation-saas`

## Troubleshooting

If you get an authentication error:
```bash
# Use personal access token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/invoice-automation-saas.git
```

Or use SSH:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/invoice-automation-saas.git
```

That's it! Your SaaS is now on GitHub and ready for deployment! 🎉