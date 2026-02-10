# TokenLaunch - Production Setup Guide

## Overview

This guide covers everything you need to deploy TokenLaunch to production with real database, payments, and smart contract integration.

## Prerequisites

- Node.js 18+
- Git
- Vercel account
- Neon database account
- Stripe account
- Wagmi/Viem knowledge

## Step 1: Environment Variables Setup

Add the following environment variables to your Vercel project:

### Database
```
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
```

### Stripe
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Blockchain
```
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org
BNB_CHAIN_ID=56
```

## Step 2: Database Setup

The database schema has been automatically created with the following tables:
- `users` - User accounts and wallet addresses
- `tokens` - Token metadata
- `token_holders` - Token holdings per user
- `transactions` - Buy/sell transactions
- `fee_shares` - Fee sharing payouts
- `payments` - Payment records (Stripe & crypto)
- `leaderboard_snapshots` - Historical leaderboard data

To verify the database is set up:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
```

## Step 3: Stripe Integration

1. Go to https://dashboard.stripe.com
2. Get your API keys from Settings > API Keys
3. Set up webhooks for these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`

4. Add webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: Select events above

## Step 4: Wallet Connection (Wagmi)

The app uses Wagmi for BNB Chain wallet connections. It automatically supports:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Other EIP-1193 compatible wallets

No additional setup needed - Wagmi handles wallet detection automatically.

## Step 5: Smart Contract Integration

To integrate Flap.sh or custom token contracts:

1. Get your contract addresses and ABIs
2. Update `/lib/contracts.ts` with your contract details
3. Implement buy/sell functions using the contract utilities

Example:
```typescript
import { getTokenInfo, getTokenBalance } from '@/lib/contracts'

const tokenInfo = await getTokenInfo('0x...')
const balance = await getTokenBalance('0x...', userAddress)
```

## Step 6: Testing Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your test values

# Run development server
npm run dev

# Open http://localhost:3000
```

## Step 7: Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or deploy directly
vercel deploy --prod
```

## Key API Endpoints

### Users
- `GET /api/users?address=0x...` - Get user info
- `POST /api/users` - Create/update user

### Tokens
- `GET /api/tokens?limit=50&offset=0` - List tokens
- `GET /api/tokens?address=0x...` - Get token by contract address
- `POST /api/tokens` - Create token

### Transactions
- `POST /api/transactions` - Record buy/sell transaction

### Payments
- `POST /api/payments/checkout` - Create Stripe checkout session

## Monitoring & Maintenance

### Database Health
- Monitor query performance in Neon dashboard
- Set up alerts for connection errors
- Regular backups (Neon does automatic daily backups)

### Stripe Monitoring
- Monitor webhooks in Stripe dashboard
- Set up email alerts for failed payments
- Review dispute resolution in Stripe dashboard

### Smart Contracts
- Monitor contract interactions on BscScan
- Track gas usage and optimize where needed
- Test thoroughly on testnet before mainnet

## Security Checklist

- [ ] All sensitive keys in environment variables only
- [ ] Stripe webhook signature verification enabled
- [ ] Database passwords strong and rotated
- [ ] HTTPS enforced
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] CORS configured properly
- [ ] Admin functions protected
- [ ] User data encryption at rest

## Troubleshooting

### Database Connection Errors
```
Error: connect ECONNREFUSED
```
- Check DATABASE_URL is correct
- Verify IP whitelist in Neon console
- Test connection: `npx tsx -e "const { neon } = require('@neondatabase/serverless'); const sql = neon(process.env.DATABASE_URL); sql('SELECT 1').then(console.log)"`

### Stripe Integration Issues
```
Error: Invalid API Key
```
- Verify API keys in environment variables
- Check you're using LIVE keys in production
- Ensure webhook secret is correct

### Wallet Connection Issues
- Check RPC URL is accessible
- Verify BNB Chain ID (should be 56)
- Test with different wallets

## Performance Optimization

1. **Database**: Add indexes for frequent queries (already done in schema)
2. **Caching**: Use React Query/SWR for client-side caching
3. **Images**: Optimize token images, use WebP format
4. **Code**: Use dynamic imports for large components
5. **CDN**: Vercel automatically uses Edge Network

## Support

- Neon support: https://neon.tech/docs
- Stripe support: https://support.stripe.com
- Wagmi docs: https://wagmi.sh
- Next.js docs: https://nextjs.org/docs
