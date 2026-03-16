# TokenLaunch Production Deployment Guide

This guide walks you through deploying TokenLaunch to production with all features enabled.

## Pre-Deployment Checklist

### Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# CoinGecko API
COINGECKO_API_KEY=your_coingecko_api_key

# SendGrid Email
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@tokenlaunch.io

# Firebase Push Notifications
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_firebase_vapid_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Flap.sh Smart Contracts
NEXT_PUBLIC_FLAP_FACTORY_ADDRESS=0x... # Flap.sh token factory contract
NEXT_PUBLIC_FLAP_BONDING_CURVE=0x... # Flap.sh bonding curve contract
NEXT_PUBLIC_FLAP_FEE_DISTRIBUTOR=0x... # Flap.sh fee distributor contract

# App URLs
NEXT_PUBLIC_APP_URL=https://tokenlaunch.io
NEXT_PUBLIC_WAGMI_CHAIN_ID=56 # BNB Chain mainnet
```

## Step-by-Step Deployment

### 1. Setup CoinGecko Price Feed

1. Go to https://www.coingecko.com/en/api/documentation
2. Get a free API key (or upgrade for higher limits)
3. Add `COINGECKO_API_KEY` to Vercel environment variables
4. The price feed will automatically:
   - Fetch token prices from CoinGecko
   - Store price history every 5 minutes
   - Populate charts with real-time data

### 2. Configure SendGrid Email Service

1. Sign up at https://sendgrid.com
2. Get your API key from Settings > API Keys
3. Verify a sender email (set `SENDGRID_FROM_EMAIL`)
4. Add keys to Vercel environment variables
5. Test with: `curl -X POST /api/notifications/email/send`

Email templates are automatically set up for:
- Welcome emails
- Price alerts
- Referral rewards
- Transaction confirmations
- Password resets

### 3. Setup Firebase Push Notifications

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Cloud Messaging
3. Create a service account and download JSON credentials
4. Extract keys and add to environment variables:
   - Server-side: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   - Client-side: `NEXT_PUBLIC_FIREBASE_*` keys
5. Generate VAPID key pair in Firebase Console > Cloud Messaging > Web Push certificates
6. The `/firebase-messaging-sw.js` service worker is already configured

### 4. Configure Stripe Payments

1. Sign up at https://stripe.com
2. Get publishable and secret keys
3. Set up webhook endpoint: `https://tokenlaunch.io/api/webhooks/stripe`
4. Add webhook secret to environment variables
5. Webhook automatically:
   - Confirms payments
   - Creates user accounts
   - Records transactions

### 5. Integrate Flap.sh Smart Contracts

1. Get Flap.sh contract addresses from their documentation
2. Update environment variables with contract addresses
3. The platform now supports:
   - Creating tokens via factory contract
   - Buying/selling via bonding curve
   - Automatic fee distribution
   - Price calculation on-chain

### 6. Deploy to Vercel

```bash
git add .
git commit -m "Production ready deployment"
git push origin main
```

Vercel will automatically:
- Build the Next.js app
- Run migrations (if configured)
- Deploy to production
- Set up auto-scaling

### 7. Post-Deployment Tasks

1. **Test Email Service**
   - Create a test account
   - Verify welcome email arrives
   - Test price alert email

2. **Test Push Notifications**
   - Enable notifications in browser
   - Trigger a price alert
   - Verify push notification appears

3. **Test Stripe Integration**
   - Use test credit card: 4242 4242 4242 4242
   - Complete a payment
   - Verify webhook logs

4. **Monitor Performance**
   - Check Vercel analytics dashboard
   - Monitor database performance in Neon
   - Set up error tracking with Sentry

5. **Setup Monitoring & Alerts**
   - Configure uptime monitoring
   - Set up error alerts
   - Monitor database query performance

## Production Features Enabled

### Price Feeds & Charts
- Real-time token prices from CoinGecko
- 24h price history stored in database
- Charts render with data from `/api/tokens/[id]/price-history`

### Email Notifications
- SendGrid integration for reliable delivery
- Multiple email templates
- Configurable user preferences
- Unsubscribe links

### Push Notifications
- Firebase Cloud Messaging for browser/mobile
- Topic-based broadcasting
- User subscription management
- Background message handling

### Smart Contract Integration
- Flap.sh token creation
- Bonding curve trading
- Automatic fee distribution
- On-chain price calculations

### Payment Processing
- Stripe checkout for USD payments
- Direct crypto payments via wagmi
- Webhook event handling
- Payment history tracking

## API Endpoints

### Tokens
- `GET /api/tokens` - List all tokens
- `GET /api/tokens/[id]` - Get token details
- `GET /api/tokens/[id]/price-history` - Price chart data
- `GET /api/tokens/[id]/comments` - Token comments
- `POST /api/tokens/[id]/comments` - Create comment

### Portfolio
- `GET /api/portfolio?userId=1` - User portfolio
- Holdings, transactions, favorites

### Referrals
- `GET /api/referrals?userId=1` - Referral stats
- `POST /api/referrals` - Claim rewards

### Notifications
- `POST /api/notifications/email/send` - Send email
- `POST /api/notifications/push` - Send push notification
- `POST /api/notifications/register-token` - Register FCM token

### Payments
- `POST /api/payments/checkout` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Stripe webhook

## Scaling Considerations

### Database
- Add read replicas for high traffic
- Use connection pooling
- Archive old transactions monthly
- Index hot tables (tokens, transactions)

### API
- Enable response caching
- Use CDN for static assets
- Rate limit public endpoints
- Setup API rate limiting per user

### Files
- Use Vercel Blob for image storage
- Compress images on upload
- Setup CDN for fast delivery
- Auto-cleanup old files

## Security Checklist

- [ ] All API keys stored in environment variables
- [ ] Database backups enabled
- [ ] HTTPS enforced site-wide
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF tokens on forms
- [ ] API authentication required

## Support & Troubleshooting

### Common Issues

**Price data not updating?**
- Check CoinGecko API key
- Verify contract addresses in database
- Check Vercel logs for fetch errors

**Emails not sending?**
- Verify SendGrid API key
- Check sender email is verified
- Review SendGrid logs

**Push notifications not working?**
- Enable notifications in browser settings
- Check Firebase configuration
- Verify service worker registered

**Stripe webhook failing?**
- Verify webhook secret matches
- Check firewall/CORS settings
- Review webhook delivery logs

## Next Steps

1. Monitor analytics and user feedback
2. Optimize slow endpoints
3. Add additional features based on demand
4. Scale infrastructure as needed
5. Implement referral rewards payout system
6. Add more price data sources
7. Expand social features
