'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, DollarSign, Eye } from 'lucide-react'
import Link from 'next/link'

interface CreatorStats {
  tokensLaunched: number
  totalVolume: number
  totalFees: number
  communitySize: number
  avgTokenRating: number
  verificationLevel: 'unverified' | 'bronze' | 'silver' | 'gold'
}

interface TokenStats {
  id: number
  name: string
  symbol: string
  marketCap: number
  volume24h: number
  holders: number
  fees: number
  status: 'active' | 'completed' | 'failed'
}

interface CreatorDashboardProps {
  stats: CreatorStats
  tokens: TokenStats[]
}

export function CreatorDashboard({ stats, tokens }: CreatorDashboardProps) {
  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'gold':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'silver':
        return 'bg-gray-400/10 text-gray-400'
      case 'bronze':
        return 'bg-orange-500/10 text-orange-500'
      default:
        return 'bg-muted/10 text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Verification */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Creator Dashboard</h2>
          <p className="mt-1 text-muted-foreground">Manage your token launches and analytics</p>
        </div>
        <div className={`rounded-full px-4 py-2 font-semibold capitalize ${getBadgeColor(stats.verificationLevel)}`}>
          {stats.verificationLevel} Creator
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Tokens Launched</div>
              <div className="mt-1 text-2xl font-bold text-foreground">{stats.tokensLaunched}</div>
            </div>
            <TrendingUp className="h-8 w-8 text-primary/50" />
          </div>
        </Card>

        <Card className="border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                ${(stats.totalVolume / 1000000).toFixed(1)}M
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-accent/50" />
          </div>
        </Card>

        <Card className="border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Fee Earnings</div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                ${stats.totalFees.toLocaleString()}
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-500/50" />
          </div>
        </Card>

        <Card className="border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Community</div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                {(stats.communitySize / 1000).toFixed(0)}K
              </div>
            </div>
            <Users className="h-8 w-8 text-blue-500/50" />
          </div>
        </Card>
      </div>

      {/* Tokens Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-card/50 px-6 py-4">
          <h3 className="font-semibold text-foreground">Your Tokens</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-card/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Token</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Market Cap</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">24h Volume</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Holders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fees Earned</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tokens.map((token) => (
                <tr key={token.id} className="hover:bg-card/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/token/${token.id}`} className="font-semibold text-primary hover:underline">
                      {token.name} ({token.symbol})
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    ${(token.marketCap / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    ${(token.volume24h / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-4 text-foreground flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {token.holders.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-green-500 font-semibold">
                    ${token.fees.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        token.status === 'active'
                          ? 'bg-green-500/10 text-green-500'
                          : token.status === 'completed'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {token.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" className="text-xs">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
