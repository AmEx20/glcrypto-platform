# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.glcrypto.ro/api
```

## Authentication
All endpoints (except /auth) require JWT token in header:
```
Authorization: Bearer {token}
```

## Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

## Endpoints

### AUTH ENDPOINTS

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "secure_password",
  "referralCode": "user123" (optional)
}

Response:
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "referralCode": "generated_code"
  },
  "token": "jwt_token"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response:
{
  "user": { ... },
  "token": "jwt_token"
}
```

### MEMBERSHIP ENDPOINTS

#### Get Membership Status
```
GET /api/membership/status
Authorization: Bearer {token}

Response:
{
  "status": "active",
  "plan": "3month",
  "expiresAt": "2024-06-25T10:00:00Z",
  "daysRemaining": 92
}
```

#### Get Available Plans
```
GET /api/membership/plans

Response:
[
  {
    "id": "1month",
    "name": "1 Month",
    "price": 29.99,
    "currency": "USD",
    "days": 30,
    "recurring": true
  },
  {
    "id": "3month",
    "name": "3 Months",
    "price": 79.99,
    "currency": "USD",
    "days": 90,
    "recurring": true,
    "discount": "10%"
  }
]
```

#### Create Checkout Session
```
POST /api/membership/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "planId": "3month",
  "autoRenew": true,
  "couponCode": "SAVE10" (optional)
}

Response:
{
  "sessionId": "cs_live_...",
  "url": "https://checkout.stripe.com/pay/cs_..."
}
```

### REFERRAL ENDPOINTS

#### Get Referral Link
```
GET /api/referral/link
Authorization: Bearer {token}

Response:
{
  "referralCode": "user_xyz123",
  "referralLink": "https://glcrypto.ro/register?ref=user_xyz123",
  "shortLink": "https://glcrypto.ro/r/xyz123"
}
```

#### Get Referral Stats
```
GET /api/referral/stats
Authorization: Bearer {token}

Response:
{
  "totalReferred": 5,
  "successfulReferrals": 3,
  "bonusDaysEarned": 90,
  "pendingRewards": 1,
  "referralHistory": [
    {
      "userId": "ref_user_id",
      "email": "referred@example.com",
      "registeredAt": "2024-03-20T10:00:00Z",
      "firstPaymentAt": "2024-03-21T15:00:00Z",
      "rewardGiven": true
    }
  ]
}
```

### ADMIN ENDPOINTS

#### Get All Members
```
GET /api/admin/members
Authorization: Bearer {admin_token}
Query params: page=1&limit=20&status=active&search=email

Response:
{
  "total": 150,
  "page": 1,
  "limit": 20,
  "members": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "status": "active",
      "plan": "3month",
      "expiresAt": "2024-06-25T10:00:00Z",
      "createdAt": "2024-03-01T00:00:00Z",
      "lastPayment": {
        "amount": 79.99,
        "date": "2024-03-24T10:00:00Z"
      }
    }
  ]
}
```

#### Create Coupon
```
POST /api/admin/coupons
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "code": "SAVE50",
  "type": "percentage",
  "value": 50,
  "maxUses": 100,
  "expiresAt": "2024-12-31T23:59:59Z"
}

Response:
{
  "id": "coupon_id",
  "code": "SAVE50",
  "type": "percentage",
  "value": 50,
  "maxUses": 100,
  "usedCount": 0,
  "active": true,
  "createdAt": "2024-03-25T10:00:00Z"
}
```

#### Create Tutorial
```
POST /api/admin/tutorials
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Elliott Wave Analysis",
  "content": "<p>Tutorial content...</p>",
  "category": "Elliott Waves",
  "videoUrl": "https://vimeo.com/123456789",
  "scheduledAt": "2024-03-26T14:00:00Z"
}

Response:
{
  "id": "tutorial_id",
  "title": "Elliott Wave Analysis",
  "category": "Elliott Waves",
  "status": "scheduled",
  "scheduledAt": "2024-03-26T14:00:00Z",
  "createdAt": "2024-03-25T10:00:00Z"
}
```

#### Update Portfolio
```
POST /api/admin/portfolio
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "holdings": [
    {
      "symbol": "BTC",
      "entryPrice": 42000,
      "quantity": 0.5,
      "currentPrice": 45000
    },
    {
      "symbol": "ETH",
      "entryPrice": 2200,
      "quantity": 5,
      "currentPrice": 2500
    }
  ]
}

Response:
{
  "total": 2,
  "updated": [
    {
      "symbol": "BTC",
      "entryPrice": 42000,
      "quantity": 0.5,
      "currentPrice": 45000,
      "profit": 1500,
      "profitPercent": 7.14
    }
  ]
}
```

### PAYMENT WEBHOOKS

#### Stripe Webhook
```
POST /api/webhooks/stripe
Content-Type: application/json

Stripe sends:
{
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      "id": "sub_...",
      "customer": "cus_...",
      "status": "active",
      "current_period_end": 1719345600
    }
  }
}

Backend processes:
1. Verify signature
2. Update membership status
3. Call SmartBill API for invoice
4. Send email to user
5. Add notification
```

## Rate Limits
- 100 requests per minute per IP
- 1000 requests per hour per API key

## Response Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error