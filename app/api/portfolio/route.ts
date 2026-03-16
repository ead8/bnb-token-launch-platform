import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get user's holdings
    const holdingsResult = await db.query(
      `SELECT 
        th.id, th.token_id, th.amount, th.average_buy_price,
        t.name, t.symbol, t.contract_address, ph.price
      FROM token_holders th
      JOIN tokens t ON th.token_id = t.id
      LEFT JOIN price_history ph ON t.id = ph.token_id
      WHERE th.user_id = $1 AND th.amount > 0
      ORDER BY th.created_at DESC`,
      [userId]
    )

    // Get user's transactions
    const transactionsResult = await db.query(
      `SELECT 
        tr.id, tr.token_id, tr.type, tr.amount, tr.price_per_token, 
        tr.total_value, tr.tx_hash, tr.created_at,
        t.name, t.symbol
      FROM transactions tr
      JOIN tokens t ON tr.token_id = t.id
      WHERE tr.user_id = $1
      ORDER BY tr.created_at DESC
      LIMIT 50`,
      [userId]
    )

    // Get user's favorites
    const favoritesResult = await db.query(
      `SELECT t.id, t.name, t.symbol, t.contract_address
      FROM token_favorites tf
      JOIN tokens t ON tf.token_id = t.id
      WHERE tf.user_id = $1`,
      [userId]
    )

    // Calculate portfolio stats
    let totalInvested = 0
    let currentValue = 0

    for (const holding of holdingsResult.rows) {
      const cost = holding.average_buy_price * holding.amount
      totalInvested += cost
      currentValue += (holding.price || holding.average_buy_price) * holding.amount
    }

    const profitLoss = currentValue - totalInvested
    const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0

    return NextResponse.json({
      portfolio: {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
        holdingsCount: holdingsResult.rows.length,
      },
      holdings: holdingsResult.rows,
      transactions: transactionsResult.rows,
      favorites: favoritesResult.rows,
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}
