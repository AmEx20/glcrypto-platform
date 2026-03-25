# System Architecture

## Overview

GLCrypto Platform is a subscription-based crypto trading education platform with integrated payment processing, affiliate system, and comprehensive admin management.

## System Components

### 1. Frontend (React + Next.js)
- **Pages:**
  - Dashboard (authenticated users)
  - Tutorials (categorized content)
  - Market Analysis (live TradingView charts)
  - Resources (scripts, indicators)
  - ZOOM Archive
  - Restricted Dashboard (expired/inactive users)
  
- **Features:**
  - Authentication (JWT)
  - Membership status check
  - Stripe payment integration
  - Referral link generation
  - Responsive design (TailwindCSS)

### 2. Backend (Node.js + Express)
- **Services:**
  - Authentication & JWT
  - Stripe payment processing
  - SmartBill invoicing
  - Telegram bot integration
  - Email notifications
  - Referral tracking

- **Database (PostgreSQL):**
  - Users
  - Memberships
  - Payments
  - Referrals
  - Coupons
  - Tutorials
  - Portfolio
  - Notifications

### 3. External APIs
- **Stripe:** Payment processing, subscriptions, webhooks
- **SmartBill:** Invoice generation and email
- **Telegram:** Bot for membership sync
- **SendGrid:** Email notifications
- **TradingView:** Embedded charts

## Data Flow

### Membership Flow
```
User → Stripe Checkout → Stripe Webhook → Backend
  → SmartBill API (invoice) → Email sent
  → Membership updated → User gets access
```

### Referral Flow
```
Referrer generates link → User registers via link
  → First payment made → Backend detects referral
  → +30 days added to referrer → Email notification
```

### Admin Actions
```
Admin updates portfolio → Database updated
  → Real-time sync → Users see live portfolio
```

### Telegram Bot Sync
```
User payment confirmed → Membership active
  → Telegram bot adds user to groups
User membership expires → Bot removes user from groups
```

## Database Schema Relationships

```
User (1) ─── (1) Membership
User (1) ─── (N) Payment
User (1) ─── (N) Referral (as referrer)
User (1) ─── (N) Referral (as referred)
User (1) ─── (N) Notification
```

## Security Considerations

1. **JWT Authentication:** All API routes protected
2. **Stripe Webhook Verification:** Signature validation
3. **Referral Validation:** One-time reward per referral
4. **Admin Access:** Role-based access control (RBAC)
5. **Environment Variables:** Secrets management
6. **HTTPS Only:** Production deployment requirement

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│  Next.js with edge functions            │
└────────────────────┬────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────────┐  ┌────▼────────┐  ┌───▼──────┐
│  Stripe    │  │  SendGrid   │  │ Telegram │
│   APIs     │  │  (Email)    │  │  Bot     │
└────────────┘  └─────────────┘  └──────────┘
    │                │                │
    └────────────────┼────────────────┘
                     │
          ┌──────────▼──────────┐
          │  Railway/Render     │
          │  (Backend Node.js)  │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │  Supabase/AWS RDS   │
          │  (PostgreSQL DB)    │
          └─────────────────────┘
```

## API Endpoints Structure

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Membership
- `GET /api/membership/status`
- `POST /api/membership/checkout`
- `GET /api/membership/plans`

### Referral
- `GET /api/referral/link`
- `GET /api/referral/stats`

### Admin
- `GET /api/admin/members`
- `GET /api/admin/payments`
- `POST /api/admin/coupons`
- `POST /api/admin/tutorials`

## Environment Requirements

- Node.js 20+
- PostgreSQL 13+
- Stripe Account
- SmartBill Account
- Telegram Bot Token
- SendGrid API Key
