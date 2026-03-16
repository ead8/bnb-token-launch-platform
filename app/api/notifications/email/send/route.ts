import { NextRequest, NextResponse } from 'next/server'
import {
  sendEmail,
  getPriceAlertEmail,
  getReferralRewardEmail,
  getTransactionConfirmationEmail,
} from '@/lib/email'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, data } = body

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user email
    const userResult = await db.query(
      'SELECT email, username FROM users WHERE id = $1',
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = userResult.rows[0]
    let emailHtml = ''
    let subject = ''

    switch (type) {
      case 'price_alert':
        subject = `Price Alert: ${data.tokenName} reached $${data.currentPrice}`
        emailHtml = getPriceAlertEmail(
          user.username,
          data.tokenName,
          data.currentPrice,
          data.targetPrice,
          data.change
        )
        break

      case 'referral_reward':
        subject = `Referral Reward: +$${data.rewardAmount}`
        emailHtml = getReferralRewardEmail(
          user.username,
          data.friendName,
          data.rewardAmount
        )
        break

      case 'transaction_confirmation':
        subject = `Transaction Confirmed: ${data.transactionType === 'buy' ? 'Purchase' : 'Sale'} of ${data.tokenName}`
        emailHtml = getTransactionConfirmationEmail(
          user.username,
          data.transactionType,
          data.tokenName,
          data.amount,
          data.price,
          data.total,
          data.txHash
        )
        break

      default:
        return NextResponse.json(
          { error: 'Unknown notification type' },
          { status: 400 }
        )
    }

    // Send email
    const success = await sendEmail({
      to: user.email,
      subject,
      html: emailHtml,
    })

    if (success) {
      // Log notification in database
      await db.query(
        `INSERT INTO notifications (user_id, type, data, sent_at)
         VALUES ($1, $2, $3, NOW())`,
        [userId, type, JSON.stringify(data)]
      )
    }

    return NextResponse.json({
      success,
      message: success ? 'Email sent successfully' : 'Failed to send email',
    })
  } catch (error) {
    console.error('[Email Notification] Error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
