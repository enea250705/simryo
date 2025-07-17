# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

## Database
```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

## NextAuth.js
```env
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Google OAuth (for NextAuth.js)
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Stripe
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## eSIM Access API
```env
ESIM_ACCESS_API_KEY="your-esim-access-api-key"
ESIM_ACCESS_BASE_URL="https://api.esimaccess.com/v1"
```

## Email (SMTP)
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@simryo.com"
```

## App Configuration
```env
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="SIMRYO"
```

## Additional Provider APIs (Optional - Currently using only eSIM Access)
```env
# Maya.net Provider
MAYA_NET_API_KEY="your-maya-net-api-key"
MAYA_NET_PARTNER_TYPE="your-partner-type"
MAYA_NET_BASE_URL="https://api.maya.net/v1"

# Simify Direct Provider
SIMIFY_DIRECT_API_KEY="your-simify-direct-api-key"
SIMIFY_DIRECT_BASE_URL="https://api.simifydirect.com/v1"

# GlobalConnect Provider
GLOBAL_CONNECT_API_KEY="your-global-connect-api-key"
GLOBAL_CONNECT_BASE_URL="https://api.globalconnect.com/v1"
```

## Production Configuration (Optional)
```env
# Redis for Caching
REDIS_URL="redis://localhost:6379"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
LOG_LEVEL="info"

# Feature Flags
ENABLE_ANALYTICS="true"
ENABLE_EMAIL_NOTIFICATIONS="true"
ENABLE_WEBHOOK_PROCESSING="true"
```

## Setup Instructions

### 1. Stripe Setup
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Set up a webhook endpoint pointing to: `https://yourdomain.com/api/stripe-webhook`
4. Add the webhook secret to your environment variables

### 2. Google OAuth Setup
1. Go to Google Cloud Console
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 3. eSIM Access Setup
1. Sign up for eSIM Access API
2. Get your API key from their dashboard
3. Add the API key to your environment variables

### 4. Email Setup (Gmail Example)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in SMTP_PASS

### 5. Database Setup
1. Set up a PostgreSQL database (NeonDB recommended)
2. Get your connection string
3. Add it to DATABASE_URL

## Testing the Setup

1. Run the database migrations:
   ```bash
   npx prisma migrate dev
   ```

2. Seed the database:
   ```bash
   node scripts/seed-database.js
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Test the complete flow:
   - Sign up/login
   - Browse plans
   - Purchase a plan
   - Check email for eSIM details
   - Verify eSIM appears in dashboard 