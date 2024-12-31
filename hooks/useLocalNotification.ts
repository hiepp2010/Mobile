import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { 
  requestNotificationPermissions, 
  scheduleNotification, 
  cancelNotification,
  cancelAllNotifications,
  getAllScheduledNotifications 
} from '../utils/notifications';
import { LocalNotification, ScheduleNotificationData } from '../types/local-notification';

export function useLocalNotifications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledNotifications, setScheduledNotifications] = useState<LocalNotification[]>([]);

  // Load scheduled notifications
  const loadScheduledNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const notifications = await getAllScheduledNotifications();
      setScheduledNotifications(
        notifications.map(notification => ({
          id: notification.identifier,
          title: notification.content.title || '',
          body: notification.content.body || '',
          timestamp: notification.trigger?.date?.getTime() || Date.now(),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Schedule a new notification
  const schedule = useCallback(async (data: ScheduleNotificationData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have permissions
      await requestNotificationPermissions();
      
      // Schedule the notification
      const id = await scheduleNotification(data);
      
      // Reload the list of scheduled notifications
      await loadScheduledNotifications();
      
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule notification');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadScheduledNotifications]);

  // Cancel a specific notification
  const cancel = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await cancelNotification(id);
      await loadScheduledNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel notification');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadScheduledNotifications]);

  // Cancel all scheduled notifications
  const cancelAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await cancelAllNotifications();
      setScheduledNotifications([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load notifications when component mounts
  useEffect(() => {
    loadScheduledNotifications();
  }, [loadScheduledNotifications]);

  // Set up notification listeners
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      Alert.alert(
        notification.request.content.title || 'Notification',
        notification.request.content.body
      );
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    scheduledNotifications,
    loading,
    error,
    schedule,
    cancel,
    cancelAll,
    loadScheduledNotifications,
  };
}

