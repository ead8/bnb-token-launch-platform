# LaunchPad Wallet Connection Setup

## Overview
LaunchPad uses **Web3Modal + Wagmi** for seamless wallet connections. This supports MetaMask, WalletConnect, and injected wallets.

## Setup Steps

### 1. Get WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your **Project ID**
4. Add to `.env.local`:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 2. Supported Wallets
The platform automatically supports:
- **MetaMask** - Desktop & Mobile
- **WalletConnect** - Universal QR-code connection
- **Injected Wallets** - Trust Wallet, Coinbase Wallet, etc.

### 3. Testing Locally
```bash
npm run dev
```

When you click "Connect Wallet" button:
1. **Web3Modal** opens
2. Shows all available wallet options
3. User selects their wallet
4. Wallet connects to BNB Chain
5. Address displays in navbar

### 4. Troubleshooting

**"Connect Wallet" button doesn't work:**
- Check that `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set in `.env.local`
- Restart dev server: `npm run dev`
- Clear browser cache and cookies
- Check browser console for errors

**MetaMask not appearing:**
- Install MetaMask extension from [metamask.io](https://metamask.io)
- Refresh the page
- Make sure you're on BNB Chain network

**Network issues:**
- Ensure you're testing on **BNB Chain (ChainID: 56)**
- MetaMask should auto-switch networks or prompt you
- If stuck on wrong network, switch manually in MetaMask

### 5. Environment Variables Needed

```bash
# REQUIRED for wallet connection
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# OPTIONAL - Firebase for push notifications
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project
```

### 6. Production Deployment

Before deploying to production:

1. **Get Production Project ID:**
   - Create new project in WalletConnect Cloud for production
   - Use different ID than development
   - Set domain whitelist in WalletConnect dashboard

2. **Add to Vercel Environment Variables:**
   - Go to Vercel Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_prod_id`
   - Redeploy

3. **Update Metadata:**
   - Verify in `app/layout.tsx` that metadata looks correct
   - Test wallet connection on production URL

## How It Works

1. User clicks **"Connect Wallet"** button
2. `useWeb3Modal()` hook opens Web3Modal dialog
3. User selects wallet from list
4. Wallet signs connection request
5. `useAccount()` hook gets address and connection status
6. Address displays in navbar
7. User can now interact with blockchain features

## Custom Styling

The Web3Modal is themed with LaunchPad's purple and gold colors in `components/privy-provider.tsx`:

```typescript
themeVariables: {
  '--w3m-color-mix': '#8B5CF6',  // Purple
  '--w3m-color-mix-strength': 40,
}
```

## Support

For issues with:
- **WalletConnect:** https://docs.walletconnect.com
- **Web3Modal:** https://docs.walletconnect.com/web3modal
- **Wagmi:** https://wagmi.sh
- **MetaMask:** https://docs.metamask.io
