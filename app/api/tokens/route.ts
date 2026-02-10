import { NextRequest, NextResponse } from 'next/server'
import { getTokens, createToken, getTokenByAddress } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')
    const contractAddress = request.nextUrl.searchParams.get('address')

    if (contractAddress) {
      const token = await getTokenByAddress(contractAddress)
      return NextResponse.json(token || { message: 'Token not found' })
    }

    const tokens = await getTokens(limit, offset)
    return NextResponse.json(tokens)
  } catch (error) {
    console.error('[v0] Error fetching tokens:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const requiredFields = [
      'name',
      'symbol',
      'description',
      'creator_address',
      'contract_address',
      'initial_supply',
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const token = await createToken(data)
    return NextResponse.json(token, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
