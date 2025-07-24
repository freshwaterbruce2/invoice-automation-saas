# 🚀 Invoice Automation SaaS - Production Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- [ ] Vercel account (free tier works)
- [ ] Supabase project created
- [ ] Stripe account (test mode first)
- [ ] Sentry account (optional)
- [ ] Domain name (optional)

## Step 1: Prepare Environment Variables

1. Copy `.env.production.example` to `.env.production.local`
2. Fill in all the production values:

### Supabase Setup
1. Go to https://app.supabase.com
2. Create a new project
3. Copy the Project URL and Anon Key
4. Run the SQL from README.md to create tables

### Stripe Setup
1. Go to https://dashboard.stripe.com
2. Switch to Production mode
3. Copy your publishable and secret keys
4. Set up webhooks (after deployment)

### Sentry Setup (Optional)
1. Go to https://sentry.io
2. Create a new project
3. Copy the DSN

## Step 2: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub:
```bash
git remote add origin https://github.com/yourusername/invoice-saas.git
git push -u origin main
```

2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add all environment variables from `.env.production.example`
7. Click "Deploy"

### Option B: Deploy via CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Follow the prompts and add environment variables when asked

## Step 3: Post-Deployment Setup

### 1. Configure Stripe Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe-webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.failed`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy the webhook secret to Vercel environment variables

### 2. Configure Custom Domain (Optional)
1. In Vercel Dashboard, go to Settings > Domains
2. Add your domain
3. Update DNS records as instructed

### 3. Enable Supabase Row Level Security
1. Go to Supabase Dashboard > Authentication > Policies
2. Ensure all RLS policies are enabled
3. Test with a new user account

### 4. Monitor Performance
1. Check Sentry for any errors
2. Monitor Vercel Analytics
3. Set up uptime monitoring (e.g., UptimeRobot)

## Step 4: Testing Production

1. Create a test account
2. Create a test invoice
3. Process a test payment (use Stripe test cards)
4. Check email notifications
5. Verify PDF generation
6. Test recurring invoices

## Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Build succeeds without errors
- [ ] Custom domain configured (if applicable)
- [ ] Stripe webhooks configured
- [ ] Supabase RLS enabled
- [ ] Sentry receiving events
- [ ] SSL certificate active
- [ ] Performance monitoring active
- [ ] Backup strategy in place

## Common Issues

### Build Fails
- Check TypeScript errors: `npm run build`
- Verify all dependencies: `npm install`
- Check environment variables

### Authentication Issues
- Verify Supabase URL and keys
- Check Supabase auth settings
- Enable email confirmations

### Payment Issues
- Verify Stripe keys (live vs test)
- Check webhook configuration
- Monitor Stripe logs

## Monitoring URLs

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- Stripe Dashboard: https://dashboard.stripe.com
- Sentry Dashboard: https://sentry.io

## Support

For issues or questions:
- Create an issue on GitHub
- Check Vercel deployment logs
- Monitor Sentry for errors

## Next Steps

1. Set up automated backups for Supabase
2. Configure rate limiting on API routes
3. Set up A/B testing
4. Implement advanced analytics
5. Add more payment methods

Congratulations! Your Invoice Automation SaaS is now live! 🎉