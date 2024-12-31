import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { initializeFirebase, requestNotificationPermission, getFCMToken } from '../config/firebase';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Load saved notifications
        const saved = await AsyncStorage.getItem('notifications');
        if (saved) {
          const parsedNotifications = JSON.parse(saved) as Notification[];
          setNotifications(parsedNotifications);
          setUnreadCount(parsedNotifications.filter(n => !n.read).length);
        }

        if (Platform.OS !== 'web') {
          // Initialize Firebase
          const initialized = initializeFirebase();
          if (!initialized) {
            throw new Error('Failed to initialize Firebase');
          }

          // Request permission for iOS
          const hasPermission = await requestNotificationPermission();
          setPermission(hasPermission);

          // Get FCM token
          const token = await getFCMToken();
          if (token) {
            console.log('FCM Token:', token);
          }

          // Set up notification handlers
          const unsubscribe = messaging().onMessage(async remoteMessage => {
            const newNotification: Notification = {
              id: remoteMessage.messageId || String(Date.now()),
              title: remoteMessage.notification?.title || 'New Notification',
              body: remoteMessage.notification?.body || '',
              timestamp: Date.now(),
              read: false,
            };

            setNotifications(prev => {
              const updated = [newNotification, ...prev];
              AsyncStorage.setItem('notifications', JSON.stringify(updated));
              return updated;
            });
            setUnreadCount(prev => prev + 1);
          });

          // Handle notification when app is in background
          messaging().setBackgroundMessageHandler(async remoteMessage => {
            const newNotification: Notification = {
              id: remoteMessage.messageId || String(Date.now()),
              title: remoteMessage.notification?.title || 'New Notification',
              body: remoteMessage.notification?.body || '',
              timestamp: Date.now(),
              read: false,
            };

            const saved = await AsyncStorage.getItem('notifications');
            const current = saved ? JSON.parse(saved) as Notification[] : [];
            const updated = [newNotification, ...current];
            await AsyncStorage.setItem('notifications', JSON.stringify(updated));
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      AsyncStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      AsyncStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(0);
  };

  const clearAll = async () => {
    setNotifications([]);
    setUnreadCount(0);
    await AsyncStorage.removeItem('notifications');
  };

  return {
    notifications,
    unreadCount,
    loading,
    permission,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}

