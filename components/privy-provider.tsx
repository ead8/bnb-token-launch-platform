'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { ReactNode, useMemo } from 'react'

export function PrivyProvider({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), [])
  
  const config = useMemo(
    () =>
      createConfig({
        chains: [bsc],
        transports: {
          [bsc.id]: http(),
        },
      }),
    []
  )

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
