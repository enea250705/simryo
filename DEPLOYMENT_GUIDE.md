# SIMRYO Deployment Guide

## Prerequisites

1. **eSIM Access API Key**
   - Sign up at https://esimaccess.com/
   - Get your API key (RT-AccessCode)
   - Update `.env.local` with your API key

2. **Database Setup**
   - PostgreSQL database (local or cloud)
   - Update `DATABASE_URL` in `.env.local`

3. **Stripe Account**
   - Create account at https://stripe.com/
   - Get API keys from dashboard
   - Update Stripe keys in `.env.local`

## Quick Setup

1. **Environment Configuration**
   ```bash
   # Copy and configure environment variables
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations (when database is ready)
   npx prisma migrate deploy
   
   # Seed database (optional)
   npm run seed
   ```

4. **Development**
   ```bash
   npm run dev
   ```

5. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Other Platforms
- **Railway**: Database + hosting
- **Render**: Full-stack deployment
- **AWS**: ECS/Lambda deployment
- **Docker**: Container deployment

## Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-domain.com"

# eSIM Access (Primary Provider)
ESIM_ACCESS_API_KEY="your-api-key"
ESIM_ACCESS_BASE_URL="https://api.esimaccess.com/v1"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

## Production Checklist

- [ ] eSIM Access API key configured
- [ ] Database connected and migrated
- [ ] Stripe webhooks configured
- [ ] Email SMTP configured
- [ ] Environment variables set
- [ ] SSL certificate configured
- [ ] Domain configured
- [ ] Analytics setup (optional)

## Testing

```bash
# Run tests
npm test

# Build verification
npm run build

# Lint check
npm run lint
```

Your SIMRYO marketplace is now ready for deployment!