import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const msg = {
      to: options.to,
      from: options.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@tokenlaunch.io',
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    }

    await sgMail.send(msg)
    console.log(`[Email] Sent to ${options.to}`)
    return true
  } catch (error) {
    console.error('[Email] Error sending email:', error)
    return false
  }
}

// Email templates

export function getWelcomeEmail(userName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #b084cc;">Welcome to TokenLaunch!</h1>
      <p>Hi ${userName},</p>
      <p>Thank you for joining TokenLaunch, the premier platform for launching and trading tokens on BNB Chain.</p>
      <p>You can now:</p>
      <ul>
        <li>Launch your own tokens with advanced features</li>
        <li>Trade tokens with low fees</li>
        <li>Earn rewards through our referral program</li>
        <li>Access creator tools and analytics</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/tokens" style="background-color: #b084cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Browse Tokens</a></p>
      <p>Best regards,<br/>The TokenLaunch Team</p>
    </div>
  `
}

export function getPriceAlertEmail(
  userName: string,
  tokenName: string,
  currentPrice: number,
  targetPrice: number,
  change: number
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #b084cc;">Price Alert: ${tokenName}</h2>
      <p>Hi ${userName},</p>
      <p>Your price alert for <strong>${tokenName}</strong> has been triggered!</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Current Price:</strong> $${currentPrice.toFixed(8)}</p>
        <p><strong>Target Price:</strong> $${targetPrice.toFixed(8)}</p>
        <p><strong>Change:</strong> <span style="color: ${change >= 0 ? '#22c55e' : '#ef4444'};">${change > 0 ? '+' : ''}${change.toFixed(2)}%</span></p>
      </div>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/token/${tokenName}" style="background-color: #b084cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Token</a></p>
      <p>Best regards,<br/>The TokenLaunch Team</p>
    </div>
  `
}

export function getReferralRewardEmail(
  userName: string,
  friendName: string,
  rewardAmount: number
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #b084cc;">Referral Reward Earned!</h2>
      <p>Hi ${userName},</p>
      <p>Great news! Your friend <strong>${friendName}</strong> has made their first token purchase and you've earned a referral reward!</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Reward Amount:</strong> <span style="color: #22c55e; font-size: 24px;">$${rewardAmount.toFixed(2)}</span></p>
      </div>
      <p>This amount has been added to your available balance and can be withdrawn anytime.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" style="background-color: #b084cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Your Rewards</a></p>
      <p>Best regards,<br/>The TokenLaunch Team</p>
    </div>
  `
}

export function getTransactionConfirmationEmail(
  userName: string,
  transactionType: 'buy' | 'sell',
  tokenName: string,
  amount: number,
  price: number,
  total: number,
  txHash: string
): string {
  const action = transactionType === 'buy' ? 'purchased' : 'sold'
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #b084cc;">Transaction Confirmed</h2>
      <p>Hi ${userName},</p>
      <p>Your ${transactionType === 'buy' ? 'purchase' : 'sale'} transaction has been confirmed on the blockchain.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Token:</strong> ${tokenName}</p>
        <p><strong>Amount:</strong> ${amount}</p>
        <p><strong>Price per token:</strong> $${price.toFixed(8)}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <p><strong>TX Hash:</strong> <code style="word-break: break-all;">${txHash}</code></p>
      </div>
      <p><a href="https://bscscan.com/tx/${txHash}" style="background-color: #b084cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View on BscScan</a></p>
      <p>Best regards,<br/>The TokenLaunch Team</p>
    </div>
  `
}

export function getPasswordResetEmail(userName: string, resetLink: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #b084cc;">Password Reset Request</h2>
      <p>Hi ${userName},</p>
      <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
      <p><a href="${resetLink}" style="background-color: #b084cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br/>The TokenLaunch Team</p>
    </div>
  `
}
