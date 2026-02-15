import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useEventsStore } from '@/stores/eventStore';
import { scheduleEventNotification } from './index';

/**
 * Initialize notification system on app startup.
 * Requests permissions and logs status for debugging.
 */
export async function initializeNotifications(): Promise<void> {
    try {
        const { status: existingStatus, ios } = await Notifications.getPermissionsAsync();

        // Log current permission state
        console.log('[Notifications] Current permission status:', existingStatus);
        if (Platform.OS === 'ios' && ios) {
            console.log('[Notifications] iOS auth status:', ios.status);
        }

        // Request if not determined
        if (existingStatus !== 'granted') {
            const { status, ios: iosResult } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                },
            });

            console.log('[Notifications] Permission request result:', status);
            if (Platform.OS === 'ios' && iosResult) {
                console.log('[Notifications] iOS auth result:', iosResult.status);
            }
        }

        // Reset badge count on app start
        await Notifications.setBadgeCountAsync(0);
        console.log('[Notifications] Badge count reset to 0');
    } catch (error) {
        console.error('[Notifications] Initialization error:', error);
    }
}

/**
 * Reschedule notification for recurring events after it fires.
 * This ensures recurring events get their next year's notification.
 */
async function rescheduleRecurringEventNotification(
    notification: Notifications.Notification
): Promise<void> {
    const eventId = notification.request.content.data?.eventId;
    if (!eventId || typeof eventId !== 'string') return;

    // Get event from store
    const events = useEventsStore.getState().events;
    const event = events.find((e) => e.id === eventId);

    if (!event) {
        console.log('[Notifications] Event not found for rescheduling:', eventId);
        return;
    }

    // Check if recurring (no specific lunarYear = recurring yearly)
    const isRecurring = event.lunarYear === undefined || event.recurrence !== undefined;
    if (!isRecurring) {
        console.log('[Notifications] One-time event, no rescheduling needed:', eventId);
        return;
    }

    // Only reschedule if reminder is still enabled
    if (!event.reminderEnabled) {
        console.log('[Notifications] Reminder disabled, skipping reschedule:', eventId);
        return;
    }

    console.log('[Notifications] Rescheduling recurring event notification:', eventId);

    // Schedule next occurrence notification
    const newNotificationId = await scheduleEventNotification(event);

    // Update event with new notification ID
    if (newNotificationId) {
        useEventsStore.getState().updateEvent(eventId, {
            notificationId: newNotificationId,
        } as any);
        console.log('[Notifications] Rescheduled with new ID:', newNotificationId);
    }
}

/**
 * Verify all recurring events have valid future notifications scheduled.
 * Called on app startup to catch notifications that fired while app was closed.
 */
async function verifyRecurringEventNotifications(): Promise<void> {
    console.log('[Notifications] Verifying recurring event notifications...');

    const events = useEventsStore.getState().events;
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const scheduledIds = new Set(scheduledNotifications.map((n) => n.identifier));

    for (const event of events) {
        // Skip if reminder not enabled
        if (!event.reminderEnabled) continue;

        // Check if recurring (no specific lunarYear = recurring yearly)
        const isRecurring = event.lunarYear === undefined || event.recurrence !== undefined;
        if (!isRecurring) continue;

        // Check if notification is still scheduled
        if (event.notificationId && scheduledIds.has(event.notificationId)) {
            continue; // Already scheduled, skip
        }

        // Notification missing or already fired - reschedule
        console.log('[Notifications] Rescheduling missing notification for:', event.id);
        const newNotificationId = await scheduleEventNotification(event);

        if (newNotificationId) {
            useEventsStore.getState().updateEvent(event.id, {
                notificationId: newNotificationId,
            } as any);
        }
    }

    console.log('[Notifications] Verification complete');
}

/**
 * Hook to set up notification listeners.
 * Must be called in root component.
 */
export function useNotificationListeners(): void {
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        // Listener for notifications received while app in foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(
            async (notification) => {
                console.log('[Notifications] Received in foreground:', notification);
                // Reschedule notification for recurring events
                await rescheduleRecurringEventNotification(notification);
            }
        );

        // Listener for notification tap/response
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            async (response) => {
                console.log('[Notifications] User response:', response);
                Notifications.setBadgeCountAsync(0);

                // Reschedule for recurring events
                await rescheduleRecurringEventNotification(response.notification);

                const eventId = response.notification.request.content.data?.eventId;
                if (eventId && typeof eventId === 'string') {
                    console.log('[Notifications] Navigating to event:', eventId);
                    // Navigate to event detail
                    router.push(`/event/${eventId}`);
                }
            }
        );

        // Handle last notification on cold start
        Notifications.getLastNotificationResponseAsync().then(async (response) => {
            if (response) {
                console.log('[Notifications] App launched from notification:', response);
                Notifications.setBadgeCountAsync(0);

                // Reschedule for recurring events
                await rescheduleRecurringEventNotification(response.notification);

                const eventId = response.notification.request.content.data?.eventId;
                if (eventId && typeof eventId === 'string') {
                    // Delay navigation to ensure router is ready
                    setTimeout(() => {
                        router.push(`/event/${eventId}`);
                    }, 500);
                }
            }
        });

        // On app startup, verify recurring events have valid notifications scheduled
        verifyRecurringEventNotifications();

        // Cleanup
        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);
}
