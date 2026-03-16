import admin from 'firebase-admin'
import { db } from './db'

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export interface PushNotification {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: Record<string, string>
  clickAction?: string
}

// Send push notification to user
export async function sendPushNotification(
  userId: number,
  notification: PushNotification
): Promise<boolean> {
  try {
    // Get user's FCM token from database
    const result = await db.query(
      'SELECT fcm_token FROM users WHERE id = $1',
      [userId]
    )

    if (result.rows.length === 0 || !result.rows[0].fcm_token) {
      console.warn(`[Firebase] No FCM token found for user ${userId}`)
      return false
    }

    const fcmToken = result.rows[0].fcm_token

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        ...(notification.icon && { imageUrl: notification.icon }),
      },
      data: {
        ...notification.data,
        timestamp: new Date().toISOString(),
      },
      webpush: {
        fcmOptions: {
          link: notification.clickAction || `${process.env.NEXT_PUBLIC_APP_URL}/notifications`,
        },
        notification: {
          title: notification.title,
          body: notification.body,
          icon: notification.icon || '/icon.svg',
          badge: notification.badge || '/badge.svg',
          clickAction: notification.clickAction,
        },
      },
    }

    const response = await admin.messaging().send(message as any)
    console.log(`[Firebase] Push sent to user ${userId}:`, response)

    // Log notification
    await logNotification(userId, 'push', notification)

    return true
  } catch (error) {
    console.error('[Firebase] Error sending push:', error)
    return false
  }
}

// Send push to multiple users (broadcast)
export async function sendBroadcastPush(
  userIds: number[],
  notification: PushNotification
): Promise<number> {
  let successCount = 0

  for (const userId of userIds) {
    const success = await sendPushNotification(userId, notification)
    if (success) successCount++
  }

  return successCount
}

// Subscribe user to topic
export async function subscribeToTopic(
  userId: number,
  topicName: string
): Promise<boolean> {
  try {
    const result = await db.query(
      'SELECT fcm_token FROM users WHERE id = $1',
      [userId]
    )

    if (result.rows.length === 0 || !result.rows[0].fcm_token) {
      return false
    }

    const fcmToken = result.rows[0].fcm_token
    await admin.messaging().subscribeToTopic(fcmToken, topicName)

    // Store subscription in database
    await db.query(
      `INSERT INTO user_topic_subscriptions (user_id, topic_name)
       VALUES ($1, $2)
       ON CONFLICT (user_id, topic_name) DO NOTHING`,
      [userId, topicName]
    )

    console.log(`[Firebase] User ${userId} subscribed to topic ${topicName}`)
    return true
  } catch (error) {
    console.error('[Firebase] Error subscribing to topic:', error)
    return false
  }
}

// Send notification to topic
export async function sendTopicPush(
  topicName: string,
  notification: PushNotification
): Promise<boolean> {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      topic: topicName,
      webpush: {
        notification: {
          title: notification.title,
          body: notification.body,
          icon: notification.icon || '/icon.svg',
        },
      },
    }

    const response = await admin.messaging().send(message as any)
    console.log(`[Firebase] Topic push sent to ${topicName}:`, response)
    return true
  } catch (error) {
    console.error('[Firebase] Error sending topic push:', error)
    return false
  }
}

// Log notification for tracking
async function logNotification(
  userId: number,
  type: string,
  data: any
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, type, data, sent_at)
       VALUES ($1, $2, $3, NOW())`,
      [userId, type, JSON.stringify(data)]
    )
  } catch (error) {
    console.error('[Firebase] Error logging notification:', error)
  }
}

// Register FCM token for user
export async function registerFCMToken(
  userId: number,
  fcmToken: string
): Promise<boolean> {
  try {
    await db.query(
      'UPDATE users SET fcm_token = $1 WHERE id = $2',
      [fcmToken, userId]
    )
    console.log(`[Firebase] Registered FCM token for user ${userId}`)
    return true
  } catch (error) {
    console.error('[Firebase] Error registering FCM token:', error)
    return false
  }
}

// Predefined notification templates
export const notificationTemplates = {
  priceAlert: (tokenName: string, price: number) => ({
    title: `${tokenName} Price Alert`,
    body: `${tokenName} reached $${price.toFixed(8)}`,
    clickAction: `/token/${tokenName}`,
  }),

  newTokenLaunched: (tokenName: string) => ({
    title: 'New Token Launched',
    body: `${tokenName} just launched on TokenLaunch! Check it out.`,
    clickAction: `/token/${tokenName}`,
  }),

  referralReward: (amount: number) => ({
    title: 'Referral Reward',
    body: `You earned $${amount.toFixed(2)} from your referral!`,
    clickAction: '/profile',
  }),

  transactionConfirmed: (type: string, tokenName: string) => ({
    title: `${type} Confirmed`,
    body: `Your ${type} of ${tokenName} has been confirmed on-chain.`,
    clickAction: '/profile',
  }),
}
