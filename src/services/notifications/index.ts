import { lunarToSolar } from '@/services/lunar';
import { LunarEvent } from '@/types/event';
import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
}

/**
 * Schedule a notification for a lunar event
 */
export async function scheduleEventNotification(
    event: LunarEvent
): Promise<string | undefined> {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
        console.log('[Notifications] Permission not granted, skipping schedule');
        return undefined;
    }

    // Calculate next occurrence solar date
    const currentYear = new Date().getFullYear();
    const targetYear = event.lunarYear ?? currentYear;

    let solar = lunarToSolar(
        event.lunarDay,
        event.lunarMonth,
        targetYear,
        event.isLeapMonth
    );

    // If date has passed this year, schedule for next year
    const solarDate = new Date(solar.year, solar.month - 1, solar.day);
    if (solarDate < new Date()) {
        solar = lunarToSolar(
            event.lunarDay,
            event.lunarMonth,
            targetYear + 1,
            event.isLeapMonth
        );
    }

    // Calculate trigger date (days before)
    const triggerDate = new Date(solar.year, solar.month - 1, solar.day);
    triggerDate.setDate(triggerDate.getDate() - event.reminderDaysBefore);

    // Set reminder time
    const [hours, minutes] = event.reminderTime.split(':').map(Number);
    triggerDate.setHours(hours, minutes, 0, 0);

    // Don't schedule if trigger date is in the past
    if (triggerDate <= new Date()) {
        console.log('[Notifications] Trigger date is in the past:', triggerDate);
        return undefined;
    }

    // Log scheduling details
    console.log('[Notifications] Scheduling notification:', {
        eventId: event.id,
        eventTitle: event.title,
        triggerDate: triggerDate.toISOString(),
        reminderDaysBefore: event.reminderDaysBefore,
    });

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: event.type === 'gio' ? `🕯️ Ngày Giỗ: ${event.title}` : event.title,
            body: getNotificationBody(event),
            data: { eventId: event.id },
            sound: true,
            badge: 1,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
        },
    });

    console.log('[Notifications] Scheduled successfully, ID:', notificationId);

    return notificationId;
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
    console.log('[Notifications] Canceling notification:', notificationId);
    await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
    console.log('[Notifications] Canceling all notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Debug utility: Get all scheduled notifications.
 */
export async function debugGetAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('[Notifications] All scheduled notifications:', notifications.length);
    notifications.forEach((n, i) => {
        console.log(`[Notifications] #${i + 1}:`, {
            id: n.identifier,
            title: n.content.title,
            trigger: n.trigger,
            data: n.content.data,
        });
    });
    return notifications;
}

/**
 * Debug utility: Check current permission status with iOS-specific details.
 */
export async function debugCheckPermissions(): Promise<void> {
    const { status, ios } = await Notifications.getPermissionsAsync();
    console.log('[Notifications] Detailed permission status:', {
        status,
        iosStatus: ios?.status,
        iosAllowAlert: ios?.allowsAlert,
        iosAllowBadge: ios?.allowsBadge,
        iosAllowSound: ios?.allowsSound,
    });
}

/**
 * Get notification body text
 */
function getNotificationBody(event: LunarEvent): string {
    const daysText =
        event.reminderDaysBefore === 0
            ? 'hôm nay'
            : event.reminderDaysBefore === 1
                ? 'ngày mai'
                : `còn ${event.reminderDaysBefore} ngày`;

    const dateText = `${event.lunarDay}/${event.lunarMonth} âm lịch`;

    if (event.type === 'gio') {
        return `Ngày giỗ ${daysText} (${dateText})`;
    }

    return `Sự kiện ${daysText} (${dateText})`;
}
