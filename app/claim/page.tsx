'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePrivy } from '@privy-io/react-auth'
import { CheckCircle, Clock, Link as LinkIcon } from 'lucide-react'

export default function ClaimPage() {
  const { user, authenticated } = usePrivy()
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    twitter: false,
    github: false,
    tiktok: false,
    twitch: false,
  })

  const [pendingClaims, setPendingClaims] = useState([
    { id: 1, platform: 'Twitter', amount: '$1,245.50', status: 'pending', link: '@crypto_trader' },
    { id: 2, platform: 'GitHub', amount: '$342.20', status: 'verified', link: 'crypto-trader' },
    { id: 3, platform: 'TikTok', amount: '$567.80', status: 'pending', link: '@cryptotrader' },
  ])

  const handleConnectPlatform = (platform: keyof typeof connectedPlatforms) => {
    // Mock connection - in production, this would redirect to OAuth
    setConnectedPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }))
  }

  const handleClaim = (id: number) => {
    setPendingClaims((prev) =>
      prev.map((claim) =>
        claim.id === id ? { ...claim, status: 'verified' } : claim
      )
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="border-b border-border bg-card/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Connect & Claim Fees</h1>
            <p className="mt-2 text-muted-foreground">
              Please connect your wallet to access fee claims
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-card/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Connect & Claim Fees</h1>
          <p className="mt-2 text-muted-foreground">
            Connect your social media accounts to verify fee earnings
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Connect Platforms */}
              <div>
                <h2 className="mb-4 text-xl font-bold text-foreground">Connect Social Accounts</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { key: 'twitter', name: 'Twitter', icon: '𝕏' },
                    { key: 'github', name: 'GitHub', icon: '⚙️' },
                    { key: 'tiktok', name: 'TikTok', icon: '🎵' },
                    { key: 'twitch', name: 'Twitch', icon: '📺' },
                  ].map((platform) => (
                    <Card
                      key={platform.key}
                      className="border border-border bg-card p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div>
                          <p className="font-semibold text-foreground">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {connectedPlatforms[platform.key as keyof typeof connectedPlatforms]
                              ? 'Connected'
                              : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={
                          connectedPlatforms[platform.key as keyof typeof connectedPlatforms]
                            ? 'outline'
                            : 'default'
                        }
                        onClick={() =>
                          handleConnectPlatform(platform.key as keyof typeof connectedPlatforms)
                        }
                      >
                        {connectedPlatforms[platform.key as keyof typeof connectedPlatforms]
                          ? 'Disconnect'
                          : 'Connect'}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pending Claims */}
              <div>
                <h2 className="mb-4 text-xl font-bold text-foreground">Your Fee Claims</h2>
                <div className="space-y-3">
                  {pendingClaims.map((claim) => (
                    <Card
                      key={claim.id}
                      className="border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          {claim.platform === 'Twitter' && '𝕏'}
                          {claim.platform === 'GitHub' && '⚙️'}
                          {claim.platform === 'TikTok' && '🎵'}
                          {claim.platform === 'Twitch' && '📺'}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{claim.platform}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <LinkIcon className="h-3 w-3" />
                            {claim.link}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="text-lg font-bold text-accent">{claim.amount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {claim.status === 'verified' ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <span className="text-sm font-medium text-green-400">Claimed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-5 w-5 text-yellow-400" />
                              <span className="text-sm font-medium text-yellow-400">Pending</span>
                            </>
                          )}
                        </div>
                        {claim.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleClaim(claim.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Claim
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Total Earnings</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending Claims</p>
                    <p className="text-2xl font-bold text-accent">$2,155.50</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">Already Claimed</p>
                    <p className="text-2xl font-bold text-green-400">$12,340.25</p>
                  </div>
                </div>
              </Card>

              <Card className="border border-primary/30 bg-primary/5 p-6">
                <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
                <ol className="space-y-2 text-xs text-muted-foreground">
                  <li>1. Connect your social accounts</li>
                  <li>2. Verify your identity</li>
                  <li>3. Claim your earnings</li>
                  <li>4. Receive directly to wallet</li>
                </ol>
              </Card>

              <Card className="border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-3">Connected Accounts</h3>
                <div className="space-y-2">
                  {Object.entries(connectedPlatforms).map(([platform, connected]) => (
                    <div key={platform} className="flex items-center gap-2">
                      {connected ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-muted" />
                      )}
                      <span className="text-xs text-muted-foreground capitalize">
                        {platform}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
