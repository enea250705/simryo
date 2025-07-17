# Vercel Deployment Guide for Simryo

## Prerequisites

1. **Database Setup**: Ensure you have a PostgreSQL database (recommended: NeonDB, Supabase, or Railway)
2. **Environment Variables**: Set up all required environment variables in Vercel

## Environment Variables Required

Add these to your Vercel project settings:

### Database
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### NextAuth.js
```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Google OAuth (Optional)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Stripe (Optional)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Email (Optional)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### eSIM Access API (Optional)
```
ESIM_ACCESS_API_KEY=your-api-key
```

## Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Set Environment Variables**: Add all required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically run the build process

## Build Process

The build process includes:
1. `prisma generate` - Generates Prisma client
2. `next build` - Builds the Next.js application

## Troubleshooting

### Prisma Client Issues
If you encounter Prisma client errors:
1. Ensure `DATABASE_URL` is correctly set
2. Check that the database is accessible from Vercel
3. Verify the database schema is up to date

### Environment Variables
- Make sure all required environment variables are set in Vercel
- Environment variables are case-sensitive
- Restart the deployment after adding new environment variables

### Database Connection
- Use connection pooling for production databases
- Ensure your database allows connections from Vercel's IP ranges
- Consider using Prisma Accelerate for better performance

## Post-Deployment

1. **Test Authentication**: Verify login/signup works
2. **Test API Endpoints**: Check that all API routes function correctly
3. **Monitor Logs**: Use Vercel's function logs to debug any issues
4. **Set up Monitoring**: Configure error tracking and performance monitoring

## Performance Optimization

- Enable Vercel's Edge Functions for better performance
- Use Prisma Accelerate for database queries
- Optimize images and static assets
- Enable caching where appropriate 