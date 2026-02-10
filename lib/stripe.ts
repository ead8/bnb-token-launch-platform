import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession(data: {
  userAddress: string
  amount: number
  tokenId?: string
  type: 'token_launch' | 'fee_share_setup'
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name:
              data.type === 'token_launch'
                ? 'Token Launch Fee'
                : 'Fee Share Platform Setup',
            description:
              data.type === 'token_launch'
                ? 'Launch your token on BNB Chain'
                : 'Setup fee sharing on social platforms',
          },
          unit_amount: Math.round(data.amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
    client_reference_id: `${data.userAddress}-${data.type}${data.tokenId ? `-${data.tokenId}` : ''}`,
    metadata: {
      userAddress: data.userAddress,
      type: data.type,
      tokenId: data.tokenId || '',
    },
  })

  return session
}

export async function getSessionDetails(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return session
}

export async function createPaymentIntent(data: {
  amount: number
  userAddress: string
  description: string
}) {
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(data.amount * 100),
    currency: 'usd',
    description: data.description,
    metadata: {
      userAddress: data.userAddress,
    },
  })

  return intent
}

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  return event
}
