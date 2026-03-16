'use client'

import { useEffect } from 'react'

export function useNotifications() {
  useEffect(() => {
    // Check if browser supports service workers and notifications
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('Browser does not support notifications')
      return
    }

    // Request notification permission
    async function initializeNotifications() {
      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        console.log('[Notifications] Service Worker registered:', registration)

        // Request permission
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission()
          console.log('[Notifications] Permission:', permission)
        }

        // Import Firebase messaging
        const { getMessaging, getToken, onMessage } = await import('firebase/messaging')
        const { initializeApp } = await import('firebase/app')

        // Initialize Firebase
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }

        const app = initializeApp(firebaseConfig)
        const messaging = getMessaging(app)

        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        })

        if (token) {
          console.log('[Notifications] FCM Token:', token.substring(0, 20) + '...')

          // Send token to server
          await fetch('/api/notifications/register-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fcmToken: token }),
          })
        }

        // Handle incoming messages
        onMessage(messaging, (payload) => {
          console.log('[Notifications] Foreground message received:', payload)

          // Show notification
          if (payload.notification) {
            new Notification(payload.notification.title || '', {
              body: payload.notification.body,
              icon: payload.notification.imageUrl || '/icon.svg',
              badge: '/badge.svg',
              data: payload.data,
            })
          }
        })
      } catch (error) {
        console.error('[Notifications] Error initializing:', error)
      }
    }

    initializeNotifications()
  }, [])

  return {
    requestPermission: async () => {
      if ('Notification' in window) {
        return await Notification.requestPermission()
      }
      return 'denied'
    },
  }
}
