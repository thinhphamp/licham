import { lunarToSolar } from '@/services/lunar';
import { LunarEvent } from '@/types/event';
import * as Notifications from 'expo-notifications';

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
 * Schedule a test notification for 5 seconds from now
 */
export async function scheduleTestNotification(): Promise<string> {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
        console.log('[Notifications] Permission denied for test notification');
        throw new Error('Permission denied');
    }

    const trigger = new Date(Date.now() + 5000); // 5s from now
    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: '📅 Lịch Việt Test',
            body: 'Thông báo test hoạt động thành công! (5s delay)',
            sound: true,
            badge: 1,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: trigger,
        },
    });
    console.log('[Notifications] Test scheduled:', id, 'at', trigger.toISOString());
    return id;
}

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

    // Helper to calculate trigger date
    const calculateTriggerDate = (s: { day: number, month: number, year: number }) => {
        const date = new Date(s.year, s.month - 1, s.day);
        date.setDate(date.getDate() - event.reminderDaysBefore);
        const [h, m] = event.reminderTime.split(':').map(Number);
        date.setHours(h, m, 0, 0);
        return date;
    };

    let triggerDate = calculateTriggerDate(solar);

    // If trigger date is in the past AND it's a recurring event (no specific year), try next year
    if (triggerDate <= new Date() && !event.lunarYear) {
        console.log('[Notifications] Target passed, checking next year...');
        solar = lunarToSolar(
            event.lunarDay,
            event.lunarMonth,
            targetYear + 1,
            event.isLeapMonth
        );
        triggerDate = calculateTriggerDate(solar);
    }

    // Final check: Don't schedule if trigger date is still in the past
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
 * Reset the app icon badge count to 0
 */
export async function resetBadgeCount(): Promise<void> {
    console.log('[Notifications] Resetting badge count');
    await Notifications.setBadgeCountAsync(0);
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
