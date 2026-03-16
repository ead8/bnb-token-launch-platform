'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface HoldingProps {
  id: number
  tokenName: string
  symbol: string
  amount: number
  buyPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
}

interface PortfolioDashboardProps {
  totalValue: number
  totalInvested: number
  totalPnl: number
  totalPnlPercent: number
  holdings: HoldingProps[]
}

export function PortfolioDashboard({
  totalValue,
  totalInvested,
  totalPnl,
  totalPnlPercent,
  holdings,
}: PortfolioDashboardProps) {
  const isPositive = totalPnl >= 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
        </Card>

        <Card className="border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Total Invested</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            ${totalInvested.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
        </Card>

        <Card className={`border border-border bg-card p-4 ${isPositive ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
          <div className="text-sm text-muted-foreground">Total P&L</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className={`text-3xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              ${Math.abs(totalPnl).toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{totalPnlPercent.toFixed(2)}%
            </span>
          </div>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-card/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Token</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Buy Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Current Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {holdings.map((holding) => (
                <tr key={holding.id} className="hover:bg-card/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-foreground">{holding.tokenName}</div>
                      <div className="text-sm text-muted-foreground">{holding.symbol}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{holding.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-foreground">${holding.buyPrice.toFixed(8)}</td>
                  <td className="px-6 py-4 text-foreground">${holding.currentPrice.toFixed(8)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {holding.pnl >= 0 ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-semibold text-green-500">
                            +${holding.pnl.toFixed(2)} ({holding.pnlPercent.toFixed(2)}%)
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <span className="font-semibold text-red-500">
                            -${Math.abs(holding.pnl).toFixed(2)} ({holding.pnlPercent.toFixed(2)}%)
                          </span>
                        </>
                      )}
                    </div>
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
