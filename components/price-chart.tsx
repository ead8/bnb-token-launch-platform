'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'

interface PriceChartProps {
  data: Array<{ time: string; price: number; volume: number }>
  symbol: string
  currentPrice: number
  priceChange24h: number
}

export function PriceChart({ data, symbol, currentPrice, priceChange24h }: PriceChartProps) {
  const isPositive = priceChange24h >= 0

  return (
    <Card className="w-full border border-border bg-card p-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground">${currentPrice.toFixed(8)}</h3>
            <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{priceChange24h.toFixed(2)}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">24h Price Change</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              domain={['dataMin - 10%', 'dataMax + 10%']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`,
                borderRadius: '0.5rem',
                color: 'var(--foreground)',
              }}
              formatter={(value: any) => [`$${value.toFixed(8)}`, 'Price']}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
