import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PrivyProvider } from '@/components/privy-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'LaunchPad - Premium Token Launch Platform on BNB Chain',
  description: 'LaunchPad: The premium platform to launch, trade, and grow your tokens on BNB Chain. Advanced features including fee sharing, market analytics, and creator dashboards.',
  generator: 'v0.app',
  icons: {
    icon: '/launchpad-logo.png',
    apple: '/launchpad-logo.png',
  },
  openGraph: {
    title: 'LaunchPad - Token Launch Platform',
    description: 'Premium token launching platform on BNB Chain',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <PrivyProvider>
          {children}
          <Analytics />
        </PrivyProvider>
      </body>
    </html>
  )
}
