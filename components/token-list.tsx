import { getTokens } from '@/lib/db'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export async function TokenListServer({ limit = 6 }: { limit?: number }) {
  try {
    const tokens = await getTokens(limit, 0)

    if (!tokens || tokens.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          No tokens found. Be the first to create one!
        </div>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tokens.map((token: any) => (
          <Link key={token.id} href={`/token/${token.id}`}>
            <Card className="group relative h-full overflow-hidden border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-primary/5 to-accent/5" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {token.image_url && (
                    <img
                      src={token.image_url || "/placeholder.svg"}
                      alt={token.name}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-foreground">
                      {token.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {token.symbol}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-foreground">
                    ${token.current_price?.toFixed(6) || '0.000000'}
                  </span>
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      (token.price_change_24h || 0) >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {(token.price_change_24h || 0) >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {Math.abs(token.price_change_24h || 0).toFixed(2)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-secondary/50 p-2">
                    <div className="text-muted-foreground">Market Cap</div>
                    <div className="font-semibold text-foreground">
                      ${(token.market_cap || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded bg-secondary/50 p-2">
                    <div className="text-muted-foreground">Holders</div>
                    <div className="font-semibold text-foreground">
                      {(token.holder_count || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    )
  } catch (error) {
    console.error('[v0] Error fetching tokens:', error)
    return (
      <div className="text-center text-red-500">
        Error loading tokens. Please try again later.
      </div>
    )
  }
}
