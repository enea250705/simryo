# eSIM Access Integration TODO

## Current Status: WORKING WITH MOCK DATA
- ✅ Package listing (real data)
- ✅ Purchase flow (mock orders)
- ✅ Email notifications
- ✅ Database storage

## TO REPLACE WITH REAL API:

### 1. Get These Endpoints from eSIM Access Support:
```
- Order Creation: POST /api/order/create
- Order Status: GET /api/order/{orderId}/status
- Order Details: GET /api/order/{orderId}
- QR Code: GET /api/qr/{iccid}
```

### 2. Update `/app/api/exec/route.ts`:

#### Replace Order Creation (Line 70-90):
```typescript
// CURRENT (MOCK):
const mockOrderId = `SIMRYO-${Date.now()}`
const mockIccid = `8901234567890${Math.random().toString().substr(2, 6)}`

// REPLACE WITH:
const orderResponse = await fetch(`${baseUrl}/api/order/create`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    packageCode: slug,
    quantity: parseInt(qty),
    customerEmail: 'from-request', // Add customer data
    customerName: 'from-request'
  })
})

const realOrderData = await orderResponse.json()
```

#### Replace Order Details (Line 95-110):
```typescript
// CURRENT (MOCK):
return NextResponse.json({
  success: true,
  iccid: iccid,
  status: 'active',
  // ... mock data
})

// REPLACE WITH:
const statusResponse = await fetch(`${baseUrl}/api/order/${iccid}/status`, {
  method: 'GET',
  headers
})
const realStatusData = await statusResponse.json()
return NextResponse.json(realStatusData)
```

### 3. Update QR Code URLs:
Replace: `https://api.esimaccess.com/qr/${iccid}`
With real QR endpoint from eSIM Access

### 4. Add Customer Data to Orders:
Pass customer email/name from purchase request to order creation

### 5. Error Handling:
Add proper error handling for real API responses

## Testing After Update:
1. Test order creation with real API
2. Verify QR codes work on mobile devices
3. Test order status tracking
4. Verify eSIM activation process