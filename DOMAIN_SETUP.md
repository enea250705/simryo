# Domain Setup Guide: simryo.com

## 🌐 Domain Configuration for Production

### 1. Vercel Domain Setup

1. **Go to Vercel Dashboard**
   - Visit your project: https://vercel.com/dashboard
   - Click on your `simryo` project

2. **Add Custom Domain**
   - Go to "Settings" → "Domains"
   - Click "Add Domain"
   - Enter: `simryo.com`
   - Enter: `www.simryo.com` (optional)

3. **Configure DNS Records**
   - **A Record**: `simryo.com` → `76.76.19.19` (Vercel IP)
   - **CNAME Record**: `www.simryo.com` → `cname.vercel-dns.com`

---

## 🔧 Updated Configuration

### Environment Variables (.env)
```env
# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://simryo.com"
NEXTAUTH_URL="https://simryo.com"
```

### Stripe Webhook Endpoint
```
https://simryo.com/api/stripe-webhook
```

### Email From Domain
```
orders@simryo.com
```

---

## 📧 Email Domain Setup (Resend)

### 1. Domain Verification
1. **Add Domain to Resend**
   - Go to https://resend.com/domains
   - Click "Add Domain"
   - Enter: `simryo.com`

2. **DNS Records for Email**
   Add these DNS records to your domain:
   ```
   TXT: simryo.com → "v=spf1 include:_spf.resend.com ~all"
   CNAME: resend._domainkey.simryo.com → resend._domainkey.resend.com
   ```

3. **Verify Domain**
   - Click "Verify Domain" in Resend dashboard
   - Wait for DNS propagation (up to 24 hours)

---

## 🚀 Deployment Checklist

### Before Domain Setup:
- [ ] Deploy to Vercel
- [ ] Test with Vercel domain (`yourproject.vercel.app`)
- [ ] Verify all APIs work

### After Domain Setup:
- [ ] Add `simryo.com` to Vercel project
- [ ] Configure DNS records
- [ ] Update environment variables
- [ ] Configure Stripe webhook with new domain
- [ ] Set up email domain in Resend
- [ ] Test all systems: `https://simryo.com/api/test-all-systems`

---

## 🧪 Testing URLs

### After Domain Setup:
- **Homepage**: https://simryo.com
- **Test All Systems**: https://simryo.com/api/test-all-systems
- **Purchase Flow Test**: 
  ```bash
  curl -X POST https://simryo.com/api/test-all-systems \
    -H "Content-Type: application/json" \
    -d '{"testType": "purchase_flow"}'
  ```

---

## 🔍 DNS Verification

### Check DNS Propagation:
```bash
# Check A record
nslookup simryo.com

# Check CNAME record  
nslookup www.simryo.com

# Check SPF record
nslookup -type=TXT simryo.com
```

### Expected Results:
```
simryo.com → 76.76.19.19 (Vercel IP)
www.simryo.com → cname.vercel-dns.com
```

---

## ⚠️ Important Notes

1. **SSL Certificate**: Vercel automatically provisions SSL certificates for custom domains
2. **Propagation Time**: DNS changes can take 24-48 hours to propagate globally
3. **Email Domain**: Must be verified in Resend before sending emails
4. **Webhook Update**: Update Stripe webhook URL after domain is live

---

## 🎯 Final Production URLs

After setup, your production URLs will be:
- **Website**: https://simryo.com
- **API**: https://simryo.com/api/*
- **Webhook**: https://simryo.com/api/stripe-webhook
- **Email**: orders@simryo.com