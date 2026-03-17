'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { ReactNode, useMemo } from 'react'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { walletConnect, injected, metaMask } from 'wagmi/connectors'

// Get projectId from env or use a fallback
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export function PrivyProvider({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), [])
  
  const config = useMemo(
    () =>
      createConfig({
        chains: [bsc],
        connectors: [
          metaMask(),
          walletConnect({ projectId }),
          injected(),
        ],
        transports: {
          [bsc.id]: http(),
        },
      }),
    []
  )

  // Initialize Web3Modal
  useMemo(() => {
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      enableAnalytics: true,
      themeMode: 'dark',
      themeVariables: {
        '--w3m-color-mix': '#8B5CF6',
        '--w3m-color-mix-strength': 40,
      },
    })
  }, [config])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
