# Stripe Webhook Configuration Guide

## 📋 Required Webhook Endpoint Configuration

### 1. Stripe Dashboard Setup

1. **Go to Stripe Dashboard**
   - Visit: https://dashboard.stripe.com/
   - Make sure you're in **LIVE MODE** (not test mode)

2. **Navigate to Webhooks**
   - Click on "Developers" in the left sidebar
   - Click on "Webhooks"
   - Click "Add endpoint"

### 2. Webhook Endpoint Configuration

**Endpoint URL:**
```
https://simryo.com/api/stripe-webhook
```

**Events to Select:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

**API Version:**
- Use the latest version (should be 2024-06-20 or newer)

### 3. Webhook Secret Configuration

1. **After creating the webhook, click on it**
2. **Copy the "Signing secret"** (starts with `whsec_`)
3. **Add to your .env file:**
```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE
```

### 4. Testing the Webhook

**Test the webhook endpoint:**
1. In Stripe Dashboard, go to your webhook
2. Click "Send test webhook"
3. Select `payment_intent.succeeded` event
4. Click "Send test webhook"

**Check your application logs** to verify the webhook is received.

---

## 🧪 System Testing

### Test All Systems
Visit: `https://simryo.com/api/test-all-systems`

This will test:
- ✅ Database connection
- ✅ Stripe API configuration
- ✅ eSIM Access API
- ✅ Email service (Resend)
- ✅ Webhook configuration

### Test Purchase Flow
```bash
curl -X POST https://simryo.com/api/test-all-systems \
  -H "Content-Type: application/json" \
  -d '{"testType": "purchase_flow"}'
```

---

## 🔧 Environment Variables Checklist

Make sure these are configured in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://..."

# Stripe (LIVE KEYS)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # ← ADD THIS

# Email
RESEND_API_KEY="re_..." # ← GET FROM https://resend.com/

# eSIM Access
ESIM_ACCESS_ENABLED=true
ESIM_ACCESS_API_KEY="your_api_key"
ESIM_ACCESS_API_SECRET="your_api_secret"
ESIM_ACCESS_BASE_URL="https://api.esimaccess.com/api/v1"

# App Config
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://simryo.com"
```

---

## 🚀 Deployment Steps

1. **Update environment variables**
2. **Deploy to Vercel**
3. **Test the system**: Visit `/api/test-all-systems`
4. **Configure Stripe webhook** (use the URL above)
5. **Test a real purchase** (small amount)

---

## 🔍 Troubleshooting

### Common Issues:

1. **Webhook not receiving events**
   - Check the endpoint URL is correct
   - Verify webhook secret is properly set
   - Check Vercel function logs

2. **Email not sending**
   - Verify Resend API key is valid
   - Check domain verification in Resend dashboard

3. **eSIM provisioning fails**
   - Verify eSIM Access API credentials
   - Check API rate limits

4. **Database connection fails**
   - Verify DATABASE_URL is correct
   - Check Neon DB connection limits

---

## 📊 Expected Test Results

When all systems are working, you should see:
```json
{
  "overallStatus": "ALL_PASS",
  "summary": "5 out of 5 tests passed",
  "tests": {
    "database": { "status": "pass" },
    "stripe": { "status": "pass" },
    "esimAccess": { "status": "pass" },
    "email": { "status": "pass" },
    "webhook": { "status": "pass" }
  }
}
```