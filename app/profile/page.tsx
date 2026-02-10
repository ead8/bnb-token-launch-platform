'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Copy, LogOut, Settings, Share2, TrendingUp, Wallet } from 'lucide-react'

export default function ProfilePage() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('tokens')

  const walletAddress = '0x1234567890123456789012345678901234567890'

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Mock user data
  const userData = {
    name: '@crypto_trader',
    earnings: {
      total: '$245,350',
      month: '$45,230',
      week: '$8,900',
    },
    stats: {
      tokensCreated: 12,
      totalHoldings: '$89,450',
      followers: 24500,
      portfolioGain: '+156.8%',
    },
  }

  const userTokens = [
    { id: 1, name: 'Rocket Fuel', symbol: 'RF', holdings: 125000, value: '$3,062', change: 156.8 },
    { id: 2, name: 'Stellar Moon', symbol: 'SM', holdings: 450000, value: '$4,005', change: 89.3 },
    { id: 3, name: 'Phoenix Rise', symbol: 'PR', holdings: 85000, value: '$4,820', change: 234.1 },
    { id: 4, name: 'Diamond Hands', symbol: 'DH', holdings: 320000, value: '$3,936', change: -12.5 },
  ]

  const createdTokens = [
    { id: 101, name: 'Creator Token 1', symbol: 'CT1', price: 0.0567, holders: 5600, mc: '780K', logo: '🎯' },
    { id: 102, name: 'Creator Token 2', symbol: 'CT2', price: 0.0234, holders: 3200, mc: '340K', logo: '🚀' },
    { id: 103, name: 'Creator Token 3', symbol: 'CT3', price: 0.0089, holders: 1800, mc: '120K', logo: '⚡' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Profile Header */}
      <section className="border-b border-border bg-gradient-to-b from-card/40 to-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
                🎭
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{userData.name}</h1>
                <p className="mt-1 text-muted-foreground">Top 1 Creator on TokenLaunch</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="mt-8 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Connected Wallet</p>
                  <p className="font-mono text-sm text-foreground">{walletAddress}</p>
                </div>
              </div>
              <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="h-5 w-5" />
              </button>
            </div>
            {copied && <p className="mt-2 text-xs text-accent">Copied!</p>}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Earnings (Month)</p>
              <p className="mt-1 text-2xl font-bold text-accent">{userData.earnings.month}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Holdings</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{userData.stats.totalHoldings}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Tokens Created</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{userData.stats.tokensCreated}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Portfolio Gain</p>
              <p className="mt-1 text-2xl font-bold text-green-400">{userData.stats.portfolioGain}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Breakdown */}
      <section className="border-b border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-foreground">Total Earnings</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="mt-2 text-3xl font-bold text-accent">{userData.earnings.week}</p>
              <p className="mt-1 text-xs text-green-400">+2.3% vs last week</p>
            </Card>
            <Card className="border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="mt-2 text-3xl font-bold text-accent">{userData.earnings.month}</p>
              <p className="mt-1 text-xs text-green-400">+12.5% vs last month</p>
            </Card>
            <Card className="border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">All Time</p>
              <p className="mt-2 text-3xl font-bold text-accent">{userData.earnings.total}</p>
              <p className="mt-1 text-xs text-muted-foreground">Since launch</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('tokens')}
              className={`border-b-2 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'tokens'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Holdings
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`border-b-2 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'created'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Created Tokens
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {activeTab === 'tokens' && (
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Token</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Holdings</th>
                    <th className="hidden px-6 py-4 text-right text-xs font-semibold text-muted-foreground md:table-cell">Value</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Change</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userTokens.map((token) => (
                    <tr key={token.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                      <td className="px-6 py-4">
                        <Link href={`/token/${token.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                          {token.name}
                          <p className="text-xs text-muted-foreground">{token.symbol}</p>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-foreground">
                        {token.holdings.toLocaleString()}
                      </td>
                      <td className="hidden px-6 py-4 text-right font-semibold text-foreground md:table-cell">
                        {token.value}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-semibold ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {token.change >= 0 ? '+' : ''}{token.change.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/token/${token.id}`}>
                          <Button size="sm" variant="outline">
                            Sell
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'created' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {createdTokens.map((token) => (
                <Link key={token.id} href={`/token/${token.id}`}>
                  <Card className="group relative h-full border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
                    <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg" />

                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{token.logo}</div>
                      <Button size="sm" variant="outline" className="gap-1 text-xs bg-transparent">
                        <Share2 className="h-3 w-3" />
                        Share
                      </Button>
                    </div>

                    <div className="mb-4">
                      <p className="font-semibold text-foreground">{token.name}</p>
                      <p className="text-xs text-muted-foreground">{token.symbol}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Market Cap</p>
                        <p className="font-semibold text-foreground">{token.mc}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Holders</p>
                        <p className="font-semibold text-foreground">{(token.holders / 1000).toFixed(1)}K</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
