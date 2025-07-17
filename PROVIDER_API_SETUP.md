# SIMRYO eSIM Provider API Setup Guide

This guide explains how to configure and integrate different eSIM providers with your SIMRYO marketplace.

## 🚀 Quick Start

1. **Copy environment variables template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your providers** in `.env.local`
3. **Test provider connections** with the health check endpoint
4. **Start accepting real orders**!

## 📋 Environment Variables Configuration

### Core Configuration

```bash
# Stripe Payment Processing
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Provider Configurations

#### eSIM Access
```bash
ESIM_ACCESS_ENABLED=true
ESIM_ACCESS_API_KEY=your_esim_access_api_key_here
ESIM_ACCESS_SECRET_KEY=your_esim_access_secret_key_here
ESIM_ACCESS_BASE_URL=https://api.esimaccess.com
```

#### Simify Direct
```bash
SIMIFY_DIRECT_ENABLED=true
SIMIFY_DIRECT_API_KEY=your_simify_direct_api_key_here
SIMIFY_DIRECT_SECRET_KEY=your_simify_direct_secret_key_here
SIMIFY_DIRECT_BASE_URL=https://api.simifydirect.com
```

#### GlobalConnect
```bash
GLOBAL_CONNECT_ENABLED=true
GLOBAL_CONNECT_API_KEY=your_global_connect_api_key_here
GLOBAL_CONNECT_SECRET_KEY=your_global_connect_secret_key_here
GLOBAL_CONNECT_BASE_URL=https://api.globalconnect.com
```

## 🔌 Provider Integration Steps

### 1. eSIM Access Integration

**Sign up**: [eSIM Access Partners](https://www.esimaccess.com/partners)

**Configuration**:
1. Get your API credentials from the partner dashboard
2. Add to `.env.local`:
   ```bash
   ESIM_ACCESS_API_KEY=ea_live_abc123...
   ESIM_ACCESS_SECRET_KEY=ea_secret_xyz789...
   ```
3. Test connection:
   ```bash
   curl http://localhost:3000/api/providers
   ```

**API Documentation**: Available at your partner dashboard

### 2. Simify Direct Integration

**Sign up**: [Simify Direct Business](https://www.simifydirect.com/business)

**Configuration**:
1. Contact Simify Direct for API access
2. Receive your API credentials
3. Add to `.env.local`:
   ```bash
   SIMIFY_DIRECT_API_KEY=sd_live_def456...
   SIMIFY_DIRECT_SECRET_KEY=sd_secret_uvw012...
   ```

**Rate Limits**: 20 requests/minute, 800 requests/hour

### 3. GlobalConnect Integration

**Sign up**: [GlobalConnect Partners](https://www.globalconnect.com/partners)

**Configuration**:
1. Apply for partner access
2. Complete integration certification
3. Add to `.env.local`:
   ```bash
   GLOBAL_CONNECT_API_KEY=gc_live_ghi789...
   GLOBAL_CONNECT_SECRET_KEY=gc_secret_rst345...
   ```

**Rate Limits**: 25 requests/minute, 1200 requests/hour

## 🔍 Testing Your Integration

### Health Check
```bash
curl http://localhost:3000/api/providers
```

Expected response:
```json
{
  "success": true,
  "data": {
    "health": {
      "enabledProviders": 3,
      "healthPercentage": 100
    }
  }
}
```

### Test Plan Fetching
```bash
# Get all plans
curl http://localhost:3000/api/plans

# Get plans for specific country
curl http://localhost:3000/api/plans/US

# Get popular plans
curl http://localhost:3000/api/plans/popular
```

### Test Purchase Flow
```bash
curl -X POST http://localhost:3000/api/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "esim-access-usa-1gb-7d",
    "customerInfo": {
      "name": "Test Customer",
      "email": "test@example.com"
    }
  }'
```

## 🛠️ Adding New Providers

### Step 1: Create Provider Class

Create a new file `lib/services/providers/your-provider.ts`:

```typescript
import { BaseProvider, ProviderPlan, PurchaseRequest, PurchaseResponse } from './base-provider'

export class YourProvider extends BaseProvider {
  getName(): string {
    return 'your-provider'
  }

  getDisplayName(): string {
    return 'Your Provider Name'
  }

  async fetchPlans(countryCode?: string): Promise<ProviderPlan[]> {
    // Implement your provider's plan fetching logic
    const response = await this.makeRequest<any>('/plans', {
      method: 'GET'
    })
    
    return response.data.map(plan => ({
      id: plan.id,
      country: plan.country,
      countryCode: plan.country_code,
      data: plan.data_amount,
      dataInMB: plan.data_mb,
      days: plan.validity_days,
      price: plan.price,
      currency: plan.currency,
      network: {
        type: plan.network_type,
        carriers: plan.carriers,
        coverage: plan.coverage
      },
      features: plan.features,
      inStock: plan.available
    }))
  }

  async purchasePlan(request: PurchaseRequest): Promise<PurchaseResponse> {
    // Implement your provider's purchase logic
    const response = await this.makeRequest<any>('/purchase', {
      method: 'POST',
      body: JSON.stringify({
        plan_id: request.planId,
        customer_email: request.customerEmail,
        customer_name: request.customerName
      })
    })

    return {
      success: true,
      orderId: response.order_id,
      qrCodeUrl: response.qr_code_url,
      activationCode: response.activation_code,
      instructions: response.instructions,
      estimatedActivationTime: response.activation_time,
      expiresAt: new Date(response.expires_at)
    }
  }

  // Implement other required methods...
}
```

### Step 2: Register Provider

Add to `lib/services/provider-manager.ts`:

```typescript
import { YourProvider } from './providers/your-provider'

// In the initializeProviders method, add:
new YourProvider({
  name: 'your-provider',
  displayName: 'Your Provider Name',
  apiKey: process.env.YOUR_PROVIDER_API_KEY || 'mock-key',
  baseUrl: process.env.YOUR_PROVIDER_BASE_URL || 'https://api.yourprovider.com',
  enabled: process.env.YOUR_PROVIDER_ENABLED !== 'false',
  rateLimits: {
    requestsPerMinute: 30,
    requestsPerHour: 1000
  }
})
```

### Step 3: Add Environment Variables

```bash
YOUR_PROVIDER_ENABLED=true
YOUR_PROVIDER_API_KEY=your_api_key_here
YOUR_PROVIDER_SECRET_KEY=your_secret_key_here
YOUR_PROVIDER_BASE_URL=https://api.yourprovider.com
```

## 🚦 API Endpoints Reference

### Plans Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/plans` | GET | Get all plans from all providers |
| `/api/plans/[country]` | GET | Get plans for specific country |
| `/api/plans/popular` | GET | Get popular plans |
| `/api/plans/check-availability` | POST | Check plan availability |

### Provider Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/providers` | GET | Get provider health status |

### Purchase Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/purchase` | POST | Purchase eSIM plan |

### Query Parameters

#### `/api/plans`
- `country`: Filter by country code (e.g., `US`, `GB`)
- `sortBy`: Sort by `price`, `data`, `days`, or `popularity`
- `sortOrder`: `asc` or `desc`
- `limit`: Maximum number of results
- `includeUnavailable`: Include out-of-stock plans

## 🔒 Security Best Practices

### API Key Management
- **Never commit API keys to version control**
- Use separate keys for development/production
- Rotate keys regularly
- Monitor API key usage

### Rate Limiting
- Respect provider rate limits
- Implement exponential backoff
- Cache responses when possible
- Monitor usage to avoid hitting limits

### Data Protection
- Encrypt sensitive customer data
- Use HTTPS for all API calls
- Validate all input data
- Log security events

## 📊 Monitoring & Logging

### Provider Health Monitoring
```bash
# Check provider status
curl http://localhost:3000/api/providers

# Expected response includes health metrics
{
  "healthPercentage": 100,
  "enabledProviders": 3,
  "providers": [...]
}
```

### Log Analysis
Monitor these log messages:
- ✅ Provider initialized
- 🔄 Fetching plans from [Provider]
- 💳 Processing purchase via [Provider]
- ❌ Provider API Error

### Performance Metrics
Track:
- API response times
- Provider success rates
- Plan fetch performance
- Purchase completion rates

## 🚨 Troubleshooting

### Common Issues

#### Provider Not Loading
```
⚠️ Provider disabled: [Provider Name]
```
**Solution**: Check API credentials and enabled status

#### Plans Not Fetching
```
❌ Failed to fetch plans from [Provider]
```
**Solutions**:
1. Verify API credentials
2. Check network connectivity
3. Confirm API endpoint URLs
4. Review rate limiting

#### Purchase Failures
```
💥 Purchase error via [Provider]
```
**Solutions**:
1. Validate plan availability
2. Check customer information format
3. Verify payment processing
4. Review provider-specific requirements

### Debug Mode

Enable debug logging:
```bash
DEBUG_MODE=true
LOG_LEVEL=debug
```

## 📈 Scaling Considerations

### Caching Strategy
- Implement Redis for plan caching
- Cache plans for 5-15 minutes
- Invalidate cache on provider updates

### Load Balancing
- Distribute requests across providers
- Implement fallback providers
- Monitor provider performance

### Database Integration
- Store order history
- Track provider analytics
- Implement user management

## 🤝 Support

### Getting Help
1. Check this documentation
2. Review provider API documentation
3. Test with debug mode enabled
4. Contact provider support teams

### Provider Support Contacts
- **eSIM Access**: support@esimaccess.com
- **Simify Direct**: api-support@simifydirect.com
- **GlobalConnect**: developers@globalconnect.com

---

**Ready to go live?** Make sure to:
- [ ] Test all provider integrations
- [ ] Verify payment processing
- [ ] Set up monitoring
- [ ] Update environment to production
- [ ] Configure proper error handling 
 
 
 

This guide explains how to configure and integrate different eSIM providers with your SIMRYO marketplace.

## 🚀 Quick Start

1. **Copy environment variables template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your providers** in `.env.local`
3. **Test provider connections** with the health check endpoint
4. **Start accepting real orders**!

## 📋 Environment Variables Configuration

### Core Configuration

```bash
# Stripe Payment Processing
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Provider Configurations

#### eSIM Access
```bash
ESIM_ACCESS_ENABLED=true
ESIM_ACCESS_API_KEY=your_esim_access_api_key_here
ESIM_ACCESS_SECRET_KEY=your_esim_access_secret_key_here
ESIM_ACCESS_BASE_URL=https://api.esimaccess.com
```

#### Simify Direct
```bash
SIMIFY_DIRECT_ENABLED=true
SIMIFY_DIRECT_API_KEY=your_simify_direct_api_key_here
SIMIFY_DIRECT_SECRET_KEY=your_simify_direct_secret_key_here
SIMIFY_DIRECT_BASE_URL=https://api.simifydirect.com
```

#### GlobalConnect
```bash
GLOBAL_CONNECT_ENABLED=true
GLOBAL_CONNECT_API_KEY=your_global_connect_api_key_here
GLOBAL_CONNECT_SECRET_KEY=your_global_connect_secret_key_here
GLOBAL_CONNECT_BASE_URL=https://api.globalconnect.com
```

## 🔌 Provider Integration Steps

### 1. eSIM Access Integration

**Sign up**: [eSIM Access Partners](https://www.esimaccess.com/partners)

**Configuration**:
1. Get your API credentials from the partner dashboard
2. Add to `.env.local`:
   ```bash
   ESIM_ACCESS_API_KEY=ea_live_abc123...
   ESIM_ACCESS_SECRET_KEY=ea_secret_xyz789...
   ```
3. Test connection:
   ```bash
   curl http://localhost:3000/api/providers
   ```

**API Documentation**: Available at your partner dashboard

### 2. Simify Direct Integration

**Sign up**: [Simify Direct Business](https://www.simifydirect.com/business)

**Configuration**:
1. Contact Simify Direct for API access
2. Receive your API credentials
3. Add to `.env.local`:
   ```bash
   SIMIFY_DIRECT_API_KEY=sd_live_def456...
   SIMIFY_DIRECT_SECRET_KEY=sd_secret_uvw012...
   ```

**Rate Limits**: 20 requests/minute, 800 requests/hour

### 3. GlobalConnect Integration

**Sign up**: [GlobalConnect Partners](https://www.globalconnect.com/partners)

**Configuration**:
1. Apply for partner access
2. Complete integration certification
3. Add to `.env.local`:
   ```bash
   GLOBAL_CONNECT_API_KEY=gc_live_ghi789...
   GLOBAL_CONNECT_SECRET_KEY=gc_secret_rst345...
   ```

**Rate Limits**: 25 requests/minute, 1200 requests/hour

## 🔍 Testing Your Integration

### Health Check
```bash
curl http://localhost:3000/api/providers
```

Expected response:
```json
{
  "success": true,
  "data": {
    "health": {
      "enabledProviders": 3,
      "healthPercentage": 100
    }
  }
}
```

### Test Plan Fetching
```bash
# Get all plans
curl http://localhost:3000/api/plans

# Get plans for specific country
curl http://localhost:3000/api/plans/US

# Get popular plans
curl http://localhost:3000/api/plans/popular
```

### Test Purchase Flow
```bash
curl -X POST http://localhost:3000/api/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "esim-access-usa-1gb-7d",
    "customerInfo": {
      "name": "Test Customer",
      "email": "test@example.com"
    }
  }'
```

## 🛠️ Adding New Providers

### Step 1: Create Provider Class

Create a new file `lib/services/providers/your-provider.ts`:

```typescript
import { BaseProvider, ProviderPlan, PurchaseRequest, PurchaseResponse } from './base-provider'

export class YourProvider extends BaseProvider {
  getName(): string {
    return 'your-provider'
  }

  getDisplayName(): string {
    return 'Your Provider Name'
  }

  async fetchPlans(countryCode?: string): Promise<ProviderPlan[]> {
    // Implement your provider's plan fetching logic
    const response = await this.makeRequest<any>('/plans', {
      method: 'GET'
    })
    
    return response.data.map(plan => ({
      id: plan.id,
      country: plan.country,
      countryCode: plan.country_code,
      data: plan.data_amount,
      dataInMB: plan.data_mb,
      days: plan.validity_days,
      price: plan.price,
      currency: plan.currency,
      network: {
        type: plan.network_type,
        carriers: plan.carriers,
        coverage: plan.coverage
      },
      features: plan.features,
      inStock: plan.available
    }))
  }

  async purchasePlan(request: PurchaseRequest): Promise<PurchaseResponse> {
    // Implement your provider's purchase logic
    const response = await this.makeRequest<any>('/purchase', {
      method: 'POST',
      body: JSON.stringify({
        plan_id: request.planId,
        customer_email: request.customerEmail,
        customer_name: request.customerName
      })
    })

    return {
      success: true,
      orderId: response.order_id,
      qrCodeUrl: response.qr_code_url,
      activationCode: response.activation_code,
      instructions: response.instructions,
      estimatedActivationTime: response.activation_time,
      expiresAt: new Date(response.expires_at)
    }
  }

  // Implement other required methods...
}
```

### Step 2: Register Provider

Add to `lib/services/provider-manager.ts`:

```typescript
import { YourProvider } from './providers/your-provider'

// In the initializeProviders method, add:
new YourProvider({
  name: 'your-provider',
  displayName: 'Your Provider Name',
  apiKey: process.env.YOUR_PROVIDER_API_KEY || 'mock-key',
  baseUrl: process.env.YOUR_PROVIDER_BASE_URL || 'https://api.yourprovider.com',
  enabled: process.env.YOUR_PROVIDER_ENABLED !== 'false',
  rateLimits: {
    requestsPerMinute: 30,
    requestsPerHour: 1000
  }
})
```

### Step 3: Add Environment Variables

```bash
YOUR_PROVIDER_ENABLED=true
YOUR_PROVIDER_API_KEY=your_api_key_here
YOUR_PROVIDER_SECRET_KEY=your_secret_key_here
YOUR_PROVIDER_BASE_URL=https://api.yourprovider.com
```

## 🚦 API Endpoints Reference

### Plans Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/plans` | GET | Get all plans from all providers |
| `/api/plans/[country]` | GET | Get plans for specific country |
| `/api/plans/popular` | GET | Get popular plans |
| `/api/plans/check-availability` | POST | Check plan availability |

### Provider Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/providers` | GET | Get provider health status |

### Purchase Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/purchase` | POST | Purchase eSIM plan |

### Query Parameters

#### `/api/plans`
- `country`: Filter by country code (e.g., `US`, `GB`)
- `sortBy`: Sort by `price`, `data`, `days`, or `popularity`
- `sortOrder`: `asc` or `desc`
- `limit`: Maximum number of results
- `includeUnavailable`: Include out-of-stock plans

## 🔒 Security Best Practices

### API Key Management
- **Never commit API keys to version control**
- Use separate keys for development/production
- Rotate keys regularly
- Monitor API key usage

### Rate Limiting
- Respect provider rate limits
- Implement exponential backoff
- Cache responses when possible
- Monitor usage to avoid hitting limits

### Data Protection
- Encrypt sensitive customer data
- Use HTTPS for all API calls
- Validate all input data
- Log security events

## 📊 Monitoring & Logging

### Provider Health Monitoring
```bash
# Check provider status
curl http://localhost:3000/api/providers

# Expected response includes health metrics
{
  "healthPercentage": 100,
  "enabledProviders": 3,
  "providers": [...]
}
```

### Log Analysis
Monitor these log messages:
- ✅ Provider initialized
- 🔄 Fetching plans from [Provider]
- 💳 Processing purchase via [Provider]
- ❌ Provider API Error

### Performance Metrics
Track:
- API response times
- Provider success rates
- Plan fetch performance
- Purchase completion rates

## 🚨 Troubleshooting

### Common Issues

#### Provider Not Loading
```
⚠️ Provider disabled: [Provider Name]
```
**Solution**: Check API credentials and enabled status

#### Plans Not Fetching
```
❌ Failed to fetch plans from [Provider]
```
**Solutions**:
1. Verify API credentials
2. Check network connectivity
3. Confirm API endpoint URLs
4. Review rate limiting

#### Purchase Failures
```
💥 Purchase error via [Provider]
```
**Solutions**:
1. Validate plan availability
2. Check customer information format
3. Verify payment processing
4. Review provider-specific requirements

### Debug Mode

Enable debug logging:
```bash
DEBUG_MODE=true
LOG_LEVEL=debug
```

## 📈 Scaling Considerations

### Caching Strategy
- Implement Redis for plan caching
- Cache plans for 5-15 minutes
- Invalidate cache on provider updates

### Load Balancing
- Distribute requests across providers
- Implement fallback providers
- Monitor provider performance

### Database Integration
- Store order history
- Track provider analytics
- Implement user management

## 🤝 Support

### Getting Help
1. Check this documentation
2. Review provider API documentation
3. Test with debug mode enabled
4. Contact provider support teams

### Provider Support Contacts
- **eSIM Access**: support@esimaccess.com
- **Simify Direct**: api-support@simifydirect.com
- **GlobalConnect**: developers@globalconnect.com

---

**Ready to go live?** Make sure to:
- [ ] Test all provider integrations
- [ ] Verify payment processing
- [ ] Set up monitoring
- [ ] Update environment to production
- [ ] Configure proper error handling 
 
 
 