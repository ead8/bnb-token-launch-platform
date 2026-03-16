import { NextRequest, NextResponse } from 'next/server'
import { getPriceHistory } from '@/lib/price-feed'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = searchParams.get('hours') || '24'
    const tokenId = parseInt(params.id)

    if (!tokenId || isNaN(tokenId)) {
      return NextResponse.json(
        { error: 'Invalid token ID' },
        { status: 400 }
      )
    }

    const priceData = await getPriceHistory(tokenId, parseInt(hours))

    // Format data for charting
    const chartData = priceData.map((data) => ({
      time: data.timestamp.toISOString(),
      value: data.price,
      volume: data.volume_24h,
      marketCap: data.market_cap,
    }))

    return NextResponse.json({
      tokenId,
      timeframe: `${hours}h`,
      data: chartData,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('Error fetching price history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    )
  }
}
