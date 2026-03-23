# LaunchPad - Premium Token Launch Platform

LaunchPad is a sophisticated, production-ready platform for launching, trading, and managing tokens on BNB Chain. Built with modern Web3 technologies, LaunchPad provides creators and traders with powerful tools to launch successful token projects.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ead8s-projects/v0-bnb-token-launch-platform)
[![Built with Next.js 16](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)

## Features

### For Token Creators
- **Easy Token Launching** - Create and launch tokens in minutes with an intuitive wizard
- **Creator Dashboard** - Advanced analytics, earnings tracking, and multi-token management
- **Fee Sharing Platform** - Automatic fee distribution across Twitter, GitHub, TikTok, and Twitch
- **Creator Verification** - Build trust with verification badges and reputation scores
- **Market Analytics** - Real-time price charts, volume tracking, and holder distribution

### For Traders
- **Advanced Portfolio Tracking** - Monitor holdings, P&L, and transaction history
- **Real-Time Price Charts** - Interactive Recharts with multiple timeframes
- **Token Discovery** - Browse and search tokens with advanced filtering
- **Security Verification** - Risk scoring, contract audits, and honeypot detection
- **Community Features** - Comments, following, and social engagement

### Platform Features
- **Bonding Curve Trading** - Fair price discovery through automated bonding curves
- **Referral Rewards System** - Earn commissions for bringing users to the platform
- **Email & Push Notifications** - Real-time alerts for price changes and events
- **Leaderboard System** - Gamified rankings for top earners and performers
- **Premium Design** - Luxury dark theme with purple and gold accents

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router and server components
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with semantic tokens
- **Recharts** - Interactive charting library for price data
- **Lucide React** - Beautiful icon library
- **Wagmi** - React hooks for Web3 interactions

### Backend
- **Next.js API Routes** - Serverless backend functions
- **Neon PostgreSQL** - Serverless database with modern SQL
- **SendGrid** - Email notification service
- **Firebase Cloud Messaging** - Push notifications
- **Stripe** - Payment processing

### Web3
- **Viem** - TypeScript interface for Ethereum
- **Wagmi** - React hooks for wallet connection
- **BNB Chain** - Primary blockchain network (ChainID: 56)
- **Flap.sh Smart Contracts** - Token creation and bonding curves

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git
- A Web3 wallet (MetaMask or similar)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/launchpad.git
cd launchpad
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@your-neon-db.neon.tech/dbname

# Wallet Connection
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Stripe Payments
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# SendGrid Email
SENDGRID_API_KEY=SG....

# Firebase Push Notifications
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Smart Contracts (Flap.sh on BNB Chain)
NEXT_PUBLIC_FLAP_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_FLAP_BONDING_CURVE=0x...
NEXT_PUBLIC_FLAP_FEE_DISTRIBUTOR=0x...
```

## Project Structure

```
launchpad/
├── app/
│   ├── api/                    # API Routes
│   │   ├── tokens/            # Token operations
│   │   ├── users/             # User management
│   │   ├── portfolio/         # Portfolio tracking
│   │   ├── referrals/         # Referral system
│   │   ├── notifications/     # Email service
│   │   ├── payments/          # Stripe integration
│   │   └── webhooks/          # Webhook handlers
│   ├── token/[id]/            # Token detail page
│   ├── tokens/                # Browse tokens
│   ├── create/                # Create token
│   ├── leaderboard/           # Leaderboard
│   ├── profile/               # User profile
│   ├── claim/                 # Fee claims
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   ├── navbar.tsx             # Navigation
│   ├── privy-provider.tsx      # Web3 provider
│   ├── price-chart.tsx        # Charts
│   ├── portfolio-dashboard.tsx # Portfolio
│   └── ...
├── lib/
│   ├── db.ts                  # Database
│   ├── price-feed.ts          # CoinGecko API
│   ├── email.ts               # SendGrid
│   ├── firebase.ts            # Firebase
│   ├── contracts.ts           # Smart contracts
│   └── stripe.ts              # Stripe
├── scripts/
│   ├── 001-init-schema.sql    # Database setup
│   └── 002-add-price-history.sql
└── public/
    └── launchpad-logo.png     # Logo
```

## Database Schema

**Core Tables:**
- `users` - User accounts and wallet addresses
- `tokens` - Token metadata (name, symbol, supply, creator)
- `token_holders` - Token holder distribution and balances
- `transactions` - All buy/sell transactions
- `price_history` - Historical price data for charting
- `fee_shares` - Platform fee earnings tracking
- `token_comments` - Community comments and discussions
- `token_security` - Security audits and risk scores
- `referrals` - Referral tracking and rewards
- `payments` - Stripe payment records

## Deployment

### Deploy to Vercel

```bash
# Push to main branch
git push origin main

# Vercel will automatically deploy
```

### Set Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

## API Documentation

### Tokens
```
GET    /api/tokens                      # List all tokens
POST   /api/tokens                      # Create token
GET    /api/tokens/[id]                 # Get details
GET    /api/tokens/[id]/price-history   # Price chart data
GET    /api/tokens/[id]/comments        # Get comments
POST   /api/tokens/[id]/comments        # Post comment
```

### Portfolio
```
GET    /api/portfolio                   # User portfolio
GET    /api/portfolio/holdings          # Token holdings
GET    /api/portfolio/transactions      # Transaction history
```

### Referrals
```
GET    /api/referrals                   # Referral data
POST   /api/referrals/claim             # Claim rewards
GET    /api/referrals/code              # Get referral code
```

### Payments
```
POST   /api/payments/checkout           # Create Stripe session
POST   /api/webhooks/stripe             # Stripe webhook
```

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format
```

## Troubleshooting

### Wallet Connection Not Working
- Ensure MetaMask or Web3 wallet is installed
- Check you're on BNB Chain (ChainID: 56)
- See [WALLET_SETUP.md](./WALLET_SETUP.md)

### Database Errors
- Verify DATABASE_URL is correct
- Check Neon database is running
- Run: `npm run db:push`

### Price Data Not Updating
- Check CoinGecko API access
- Verify price_history table exists
- Check service logs

## Documentation

- [WALLET_SETUP.md](./WALLET_SETUP.md) - Wallet connection guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- [FEATURES_IMPLEMENTATION.md](./FEATURES_IMPLEMENTATION.md) - Feature details
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Setup checklist

## Performance

- Turbopack for fast builds
- Optimized database queries with indexes
- Server-side rendering for SEO
- Image optimization
- CDN caching

## Security

- Environment variables for sensitive data
- Secure cookie sessions
- HTTPS enforced in production
- Smart contract audits recommended
- Input validation and sanitization

## License

MIT License - see LICENSE file

## Support

- GitHub Issues for bug reports
- Documentation in `/docs`
- Deployment guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Roadmap

- Mobile app (React Native)
- Advanced charting (TradingView)
- DAO governance
- Cross-chain launches
- NFT launchpad
- Trading bots marketplace

---

**LaunchPad** - Premium Token Launching on BNB Chain
