import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Copy, Share2, Heart } from 'lucide-react'

// Mock token data
const TOKEN_DATA = {
  1: {
    name: 'Rocket Fuel',
    symbol: 'RF',
    price: 0.0245,
    change: 156.8,
    holders: 12500,
    mc: '2.45M',
    volume24h: '245K',
    logo: '🚀',
    description: 'The ultimate fuel for your DeFi journey on BNB Chain. Rocket Fuel powers the next generation of token launches.',
    tokenAddress: '0x1234567890123456789012345678901234567890',
    feeSharing: ['Twitter', 'GitHub', 'TikTok'],
    taxRate: 5,
    holdersData: [
      { address: '0x123...', percentage: 12.5, amount: '1.2M' },
      { address: '0x456...', percentage: 8.3, amount: '800K' },
      { address: '0x789...', percentage: 6.1, amount: '580K' },
      { address: '0xabc...', percentage: 4.2, amount: '400K' },
      { address: '0xdef...', percentage: 3.8, amount: '360K' },
    ],
    bondingCurveData: { current: 65, max: 100 },
  },
}

async function TokenDetailContent({ id }: { id: string }) {
  const token = TOKEN_DATA[id as keyof typeof TOKEN_DATA]

  if (!token) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <p className="text-muted-foreground">Token not found</p>
          <Link href="/tokens">
            <Button className="mt-4">Back to Tokens</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isPositive = token.change >= 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-card/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{token.logo}</div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{token.name}</h1>
              <p className="text-muted-foreground">{token.symbol}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Price Card */}
              <Card className="border border-border bg-card p-6">
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-4xl font-bold text-foreground">${token.price.toFixed(4)}</p>
                    </div>
                    <div className={`text-right text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <div className="flex items-center gap-1 justify-end">
                        {isPositive ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                        {Math.abs(token.change).toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">24h change</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Market Cap</p>
                      <p className="text-lg font-semibold text-foreground">{token.mc}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">24h Volume</p>
                      <p className="text-lg font-semibold text-foreground">{token.volume24h}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Holders</p>
                      <p className="text-lg font-semibold text-foreground">{(token.holders / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bonding Curve */}
              <Card className="border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Bonding Curve</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress to Listing</span>
                    <span className="font-semibold text-foreground">{token.bondingCurveData.current}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${token.bondingCurveData.current}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {token.bondingCurveData.current}% collected, {token.bondingCurveData.max - token.bondingCurveData.current}% remaining until DEX listing
                  </p>
                </div>
              </Card>

              {/* Token Info */}
              <Card className="border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Token Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="mt-1 text-foreground">{token.description}</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="mb-2 text-sm text-muted-foreground">Contract Address</p>
                    <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                      <code className="flex-1 font-mono text-xs text-foreground">{token.tokenAddress}</code>
                      <button
                        onClick={() => handleCopy(token.tokenAddress)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    {copied && <p className="mt-1 text-xs text-accent">Copied!</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tax Rate</p>
                      <p className="text-lg font-semibold text-foreground">{token.taxRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fee Sharing</p>
                      <div className="flex gap-2 mt-1">
                        {token.feeSharing.map((platform) => (
                          <span key={platform} className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Top Holders */}
              <Card className="border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Top Holders</h3>
                <div className="space-y-3">
                  {token.holdersData.map((holder, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-background">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-mono text-sm text-foreground">{holder.address}</p>
                          <p className="text-xs text-muted-foreground">{holder.amount}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{holder.percentage}%</p>
                        <div className="h-1.5 w-16 rounded-full bg-muted mt-1">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${holder.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar - Trading */}
            <div className="space-y-4">
              {/* Buy Card */}
              <Card className="border border-primary/50 bg-gradient-to-br from-primary/10 to-background p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Buy {token.symbol}</h3>
                <div className="space-y-3">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <p className="text-lg font-bold text-foreground">${token.price.toFixed(4)} BNB</p>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Connect Wallet to Buy</Button>
                </div>
              </Card>

              {/* Sell Card */}
              <Card className="border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Sell {token.symbol}</h3>
                <div className="space-y-3">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <p className="text-lg font-bold text-foreground">${token.price.toFixed(4)} BNB</p>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700">Connect Wallet to Sell</Button>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                  <Heart className="h-4 w-4" />
                  Favorite
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              {/* Stats Box */}
              <Card className="border border-border bg-card p-6">
                <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium text-foreground">2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Liquidity</span>
                    <span className="font-medium text-foreground">$1.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Satoshi Score</span>
                    <span className="font-medium text-accent">8.5/10</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default async function TokenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TokenDetailContent id={id} />
}
