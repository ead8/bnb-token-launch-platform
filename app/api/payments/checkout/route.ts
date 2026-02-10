import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { userAddress, amount, tokenId, type, returnUrl } =
      await request.json()

    if (!userAddress || !amount || !type) {
      return NextResponse.json(
        { error: 'userAddress, amount, and type are required' },
        { status: 400 }
      )
    }

    if (!['token_launch', 'fee_share_setup'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      )
    }

    const baseUrl = request.headers.get('origin') || 'http://localhost:3000'

    const session = await createCheckoutSession({
      userAddress,
      amount,
      tokenId,
      type,
      successUrl: `${baseUrl}${returnUrl || '/'}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}${returnUrl || '/'}?canceled=true`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('[v0] Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
