import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/stripe'
import { recordPayment, createUser } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userAddress = session.client_reference_id?.split('-')[0]

        if (!userAddress) {
          console.error('[v0] Invalid client reference id:', session.client_reference_id)
          break
        }

        // Create user if doesn't exist
        await createUser(userAddress)

        // Get amount from session
        const amountTotal = session.amount_total || 0
        const amountInUSD = amountTotal / 100

        // Record payment
        await recordPayment({
          user_address: userAddress,
          amount: amountInUSD,
          currency: 'USD',
          stripe_payment_id: session.payment_intent as string,
        })

        console.log('[v0] Payment recorded for:', userAddress, 'Amount:', amountInUSD)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('[v0] Payment failed:', paymentIntent.id, paymentIntent.last_payment_error)
        // You could send an email notification here
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('[v0] Payment succeeded:', paymentIntent.id)
        break
      }

      default:
        console.log('[v0] Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
