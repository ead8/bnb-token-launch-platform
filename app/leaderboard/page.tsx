'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trophy, TrendingUp, Users } from 'lucide-react'

// Mock leaderboard data
const TOP_EARNERS = [
  { rank: 1, name: '@crypto_trader', earnings: '245,350', tokens: 12, followers: 24500, badge: '🏆' },
  { rank: 2, name: '@token_master', earnings: '189,200', tokens: 8, followers: 18900, badge: '🥈' },
  { rank: 3, name: '@moon_shot', earnings: '156,780', tokens: 15, followers: 15600, badge: '🥉' },
  { rank: 4, name: '@degen_life', earnings: '134,560', tokens: 6, followers: 13450 },
  { rank: 5, name: '@btc_whale', earnings: '128,900', tokens: 9, followers: 12890 },
  { rank: 6, name: '@altcoin_hub', earnings: '112,340', tokens: 20, followers: 11230 },
  { rank: 7, name: '@yield_farmer', earnings: '98,760', tokens: 7, followers: 9876 },
  { rank: 8, name: '@nft_collector', earnings: '87,540', tokens: 4, followers: 8750 },
  { rank: 9, name: '@defi_expert', earnings: '76,230', tokens: 11, followers: 7620 },
  { rank: 10, name: '@smart_money', earnings: '65,890', tokens: 5, followers: 6590 },
]

const TOP_TOKENS = [
  { rank: 1, name: 'Phoenix Rise', symbol: 'PR', volume: '234K', creators: 3, score: 98 },
  { rank: 2, name: 'Rocket Fuel', symbol: 'RF', volume: '189K', creators: 2, score: 95 },
  { rank: 3, name: 'Sky Limit', symbol: 'SL', volume: '167K', creators: 4, score: 92 },
  { rank: 4, name: 'Quantum Leap', symbol: 'QL', volume: '145K', creators: 2, score: 88 },
  { rank: 5, name: 'Wave Protocol', symbol: 'WV', volume: '123K', creators: 1, score: 85 },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('earners')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-card/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          </div>
          <p className="text-muted-foreground">Top creators, tokens, and earners on the platform</p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="border-b border-border bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Earner This Month</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">$245,350</p>
                </div>
                <Trophy className="h-12 w-12 text-accent/30" />
              </div>
            </Card>
            <Card className="border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume Traded</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">$8.4M</p>
                </div>
                <TrendingUp className="h-12 w-12 text-primary/30" />
              </div>
            </Card>
            <Card className="border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Creators</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">2,450</p>
                </div>
                <Users className="h-12 w-12 text-green-500/30" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('earners')}
              className={`border-b-2 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'earners'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Top Earners
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`border-b-2 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'tokens'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Top Tokens
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {activeTab === 'earners' && (
            <div className="space-y-3">
              {TOP_EARNERS.map((earner) => (
                <Card
                  key={earner.rank}
                  className="border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                      <span className="text-lg font-bold text-background">
                        {earner.badge || `#${earner.rank}`}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{earner.name}</p>
                      <div className="mt-1 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>{earner.tokens} tokens created</span>
                        <span>{earner.followers.toLocaleString()} followers</span>
                      </div>
                    </div>

                    {/* Earnings */}
                    <div className="hidden text-right sm:block">
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-lg font-bold text-accent">${earner.earnings}</p>
                    </div>

                    {/* View Button */}
                    <Link href="/profile">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Token</th>
                    <th className="hidden px-6 py-4 text-right text-xs font-semibold text-muted-foreground md:table-cell">24h Volume</th>
                    <th className="hidden px-6 py-4 text-right text-xs font-semibold text-muted-foreground lg:table-cell">Creators</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Score</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_TOKENS.map((token) => (
                    <tr key={token.rank} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                      <td className="px-6 py-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-background">
                          {token.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-foreground">{token.name}</p>
                          <p className="text-xs text-muted-foreground">{token.symbol}</p>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 text-right font-semibold text-foreground md:table-cell">
                        ${token.volume}
                      </td>
                      <td className="hidden px-6 py-4 text-right text-foreground lg:table-cell">{token.creators}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="rounded-full bg-accent/20 px-2 py-1 text-xs font-bold text-accent">
                          {token.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/token/1`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
