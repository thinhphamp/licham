import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

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
 * Hook to set up notification listeners.
 * Must be called in root component.
 */
export function useNotificationListeners(): void {
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        // Listener for notifications received while app in foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log('[Notifications] Received in foreground:', notification);
                // Handler config in @/services/notifications/index.ts handles display
            }
        );

        // Listener for notification tap/response
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log('[Notifications] User response:', response);
                Notifications.setBadgeCountAsync(0);

                const eventId = response.notification.request.content.data?.eventId;
                if (eventId && typeof eventId === 'string') {
                    console.log('[Notifications] Navigating to event:', eventId);
                    // Navigate to event detail
                    router.push(`/event/${eventId}`);
                }
            }
        );

        // Handle last notification on cold start
        Notifications.getLastNotificationResponseAsync().then((response) => {
            if (response) {
                console.log('[Notifications] App launched from notification:', response);
                Notifications.setBadgeCountAsync(0);
                const eventId = response.notification.request.content.data?.eventId;
                if (eventId && typeof eventId === 'string') {
                    // Delay navigation to ensure router is ready
                    setTimeout(() => {
                        router.push(`/event/${eventId}`);
                    }, 500);
                }
            }
        });

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
