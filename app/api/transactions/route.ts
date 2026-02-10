import { NextRequest, NextResponse } from 'next/server'
import { recordTransaction } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const requiredFields = [
      'token_id',
      'user_address',
      'type',
      'amount',
      'price_per_unit',
      'tx_hash',
    ]

    for (const field of requiredFields) {
      if (data[field] === undefined) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    if (!['buy', 'sell'].includes(data.type)) {
      return NextResponse.json(
        { error: 'Type must be buy or sell' },
        { status: 400 }
      )
    }

    const transaction = await recordTransaction(data)
    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('[v0] Error recording transaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
