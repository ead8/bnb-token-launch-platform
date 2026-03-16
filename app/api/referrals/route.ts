import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// GET referral stats
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

    // Get referral stats
    const statsResult = await db.query(
      `SELECT 
        COUNT(*) as total_referrals,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN commission_amount ELSE 0 END), 0) as earned,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END), 0) as pending
      FROM referrals
      WHERE referrer_id = $1`,
      [userId]
    )

    const stats = statsResult.rows[0]

    // Get referral history
    const historyResult = await db.query(
      `SELECT 
        r.id, r.referred_user_id, r.status, r.commission_amount, r.created_at,
        u.username, u.email
      FROM referrals r
      LEFT JOIN users u ON r.referred_user_id = u.id
      WHERE r.referrer_id = $1
      ORDER BY r.created_at DESC`,
      [userId]
    )

    // Generate or get referral link
    const linkResult = await db.query(
      'SELECT referral_code FROM users WHERE id = $1',
      [userId]
    )

    let referralCode = linkResult.rows[0]?.referral_code
    if (!referralCode) {
      referralCode = crypto.randomBytes(8).toString('hex')
      await db.query(
        'UPDATE users SET referral_code = $1 WHERE id = $2',
        [referralCode, userId]
      )
    }

    return NextResponse.json({
      stats: {
        totalReferrals: parseInt(stats.total_referrals),
        completedReferrals: parseInt(stats.completed_referrals),
        earned: parseFloat(stats.earned),
        pending: parseFloat(stats.pending),
      },
      referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL}?ref=${referralCode}`,
      history: historyResult.rows,
    })
  } catch (error) {
    console.error('Error fetching referral data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    )
  }
}

// POST claim pending rewards
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get pending rewards
    const pendingResult = await db.query(
      `SELECT COALESCE(SUM(commission_amount), 0) as total
       FROM referrals
       WHERE referrer_id = $1 AND status = 'pending'`,
      [userId]
    )

    const pendingAmount = parseFloat(pendingResult.rows[0].total || 0)

    if (pendingAmount <= 0) {
      return NextResponse.json(
        { error: 'No pending rewards to claim' },
        { status: 400 }
      )
    }

    // Mark all pending as claimed
    await db.query(
      `UPDATE referrals SET status = 'claimed', claimed_at = NOW()
       WHERE referrer_id = $1 AND status = 'pending'`,
      [userId]
    )

    // Create payout record
    await db.query(
      `INSERT INTO payouts (user_id, amount, status, type)
       VALUES ($1, $2, 'pending', 'referral_reward')`,
      [userId, pendingAmount]
    )

    return NextResponse.json({
      success: true,
      message: `Successfully claimed $${pendingAmount.toFixed(2)} in rewards`,
      claimedAmount: pendingAmount,
    })
  } catch (error) {
    console.error('Error claiming referral rewards:', error)
    return NextResponse.json(
      { error: 'Failed to claim rewards' },
      { status: 500 }
    )
  }
}
