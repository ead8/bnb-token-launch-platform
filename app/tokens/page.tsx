'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown, ArrowUpDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Mock data
const ALL_TOKENS = [
  { id: 1, name: 'Rocket Fuel', symbol: 'RF', price: 0.0245, change: 156.8, volume: '245K', mc: '2.45M', logo: '🚀', holders: 12500 },
  { id: 2, name: 'Stellar Moon', symbol: 'SM', price: 0.0089, change: 89.3, volume: '156K', mc: '1.78M', logo: '🌙', holders: 8900 },
  { id: 3, name: 'Phoenix Rise', symbol: 'PR', price: 0.0567, change: 234.1, volume: '567K', mc: '5.67M', logo: '🔥', holders: 19300 },
  { id: 4, name: 'Diamond Hands', symbol: 'DH', price: 0.0123, change: -12.5, volume: '98K', mc: '780K', logo: '💎', holders: 5600 },
  { id: 5, name: 'Sky Limit', symbol: 'SL', price: 0.0678, change: 124.6, volume: '432K', mc: '6.78M', logo: '🌌', holders: 14200 },
  { id: 6, name: 'Quantum Leap', symbol: 'QL', price: 0.0234, change: 67.2, volume: '212K', mc: '2.34M', logo: '⚡', holders: 9800 },
  { id: 7, name: 'Wave Protocol', symbol: 'WV', price: 0.0012, change: 445.2, volume: '89K', mc: '120K', logo: '🌊', holders: 2100 },
  { id: 8, name: 'Volt Energy', symbol: 'VLT', price: 0.0034, change: 289.8, volume: '145K', mc: '340K', logo: '⚡', holders: 3400 },
  { id: 9, name: 'Aurora Borealis', symbol: 'AB', price: 0.0056, change: 156.3, volume: '203K', mc: '560K', logo: '🌌', holders: 1800 },
]

type SortKey = 'mc' | 'volume' | 'change' | 'holders'

const Loading = () => null

export default function TokensPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('mc')
  const [filterTax, setFilterTax] = useState('all')
  const searchParams = useSearchParams()

  const filteredTokens = ALL_TOKENS
    .filter((token) => {
      const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'mc':
          return parseFloat(b.mc) - parseFloat(a.mc)
        case 'volume':
          return parseFloat(b.volume) - parseFloat(a.volume)
        case 'change':
          return b.change - a.change
        case 'holders':
          return b.holders - a.holders
        default:
          return 0
      }
    })

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Header */}
        <section className="border-b border-border bg-card/30 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground">All Tokens</h1>
            <p className="mt-2 text-muted-foreground">Browse and discover tokens on BNB Chain</p>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="border-b border-border bg-background py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 text-base bg-input border-border"
                />
              </div>

              {/* Filter & Sort Controls */}
              <div className="flex flex-wrap gap-3">
                {/* Sort Dropdown */}
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                    className="appearance-none rounded-lg border border-border bg-card px-4 py-2 pr-8 text-sm font-medium text-foreground hover:border-primary/50 cursor-pointer"
                  >
                    <option value="mc">Sort by Market Cap</option>
                    <option value="volume">Sort by Volume</option>
                    <option value="change">Sort by Change</option>
                    <option value="holders">Sort by Holders</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>

                {/* Tax Filter */}
                <div className="relative inline-block">
                  <select
                    value={filterTax}
                    onChange={(e) => setFilterTax(e.target.value)}
                    className="appearance-none rounded-lg border border-border bg-card px-4 py-2 pr-8 text-sm font-medium text-foreground hover:border-primary/50 cursor-pointer"
                  >
                    <option value="all">All Tax Rates</option>
                    <option value="1">1% Tax</option>
                    <option value="3">3% Tax</option>
                    <option value="5">5% Tax</option>
                    <option value="10">10% Tax</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tokens Table */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredTokens.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tokens found matching your search</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Token</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Price</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Change</th>
                      <th className="hidden px-6 py-4 text-right text-xs font-semibold text-muted-foreground md:table-cell">Market Cap</th>
                      <th className="hidden px-6 py-4 text-right text-xs font-semibold text-muted-foreground lg:table-cell">Volume</th>
                      <th className="hidden px-6 py-4 text-right text-xs font-semibold text-muted-foreground lg:table-cell">Holders</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTokens.map((token) => (
                      <tr key={token.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                        <td className="px-6 py-4">
                          <Link href={`/token/${token.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                            <span className="text-2xl">{token.logo}</span>
                            <div>
                              <div className="font-semibold text-foreground">{token.name}</div>
                              <div className="text-xs text-muted-foreground">{token.symbol}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-foreground">${token.price.toFixed(4)}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-sm font-semibold ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change >= 0 ? '+' : ''}{token.change.toFixed(1)}%
                          </span>
                        </td>
                        <td className="hidden px-6 py-4 text-right text-foreground md:table-cell">{token.mc}</td>
                        <td className="hidden px-6 py-4 text-right text-foreground lg:table-cell">{token.volume}</td>
                        <td className="hidden px-6 py-4 text-right text-foreground lg:table-cell">{token.holders.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/token/${token.id}`}>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
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
    </Suspense>
  )
}
