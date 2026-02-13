# Phase 3: Debugging Utilities

## Overview

- **Priority**: P2
- **Status**: completed
- **Effort**: 30min
- **Depends On**: Phase 1

Add debugging functions to verify notification scheduling and diagnose issues.

## Context Links

- [Research: Notification Scheduling](research/researcher-02-notification-scheduling.md)
- `getNextTriggerDateAsync()` and `getAllScheduledNotificationsAsync()` APIs

## Key Insights

1. **Audit scheduled notifications**: `getAllScheduledNotificationsAsync()` returns all pending notifications
2. **Verify trigger timing**: `getNextTriggerDateAsync(trigger)` calculates next fire date
3. **Console logging**: Essential for debugging on physical device
4. **Settings integration**: Optional debug toggle in settings screen

## Requirements

### Functional
- Log notification details when scheduled
- Provide function to list all scheduled notifications
- Verify trigger date is valid before scheduling

### Non-functional
- Debug logs only in development
- Minimal performance impact

## Related Code Files

### Modify
- `src/services/notifications/index.ts` - Add debug logging and utilities

## Implementation Steps

### Step 1: Add debug logging to scheduleEventNotification

Update `src/services/notifications/index.ts`:

```typescript
export async function scheduleEventNotification(
    event: LunarEvent
): Promise<string | undefined> {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
        console.log('[Notifications] Permission not granted, skipping schedule');
        return undefined;
    }

    // ... existing date calculation code ...

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
        // ... existing config
    });

    console.log('[Notifications] Scheduled successfully, ID:', notificationId);

    return notificationId;
}
```

### Step 2: Add getAllScheduledNotifications utility

```typescript
/**
 * Debug utility: Get all scheduled notifications.
 * Useful for verifying notifications are queued.
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
```

### Step 3: Add trigger date verification

```typescript
/**
 * Debug utility: Verify trigger date for a notification.
 */
export async function debugVerifyTriggerDate(
    trigger: Notifications.NotificationTriggerInput
): Promise<Date | null> {
    try {
        const nextDate = await Notifications.getNextTriggerDateAsync(trigger);
        console.log('[Notifications] Next trigger date:', nextDate ? new Date(nextDate) : null);
        return nextDate ? new Date(nextDate) : null;
    } catch (error) {
        console.error('[Notifications] Trigger date verification failed:', error);
        return null;
    }
}
```

### Step 4: Add permission status check

```typescript
/**
 * Debug utility: Check current permission status with iOS-specific details.
 */
export async function debugCheckPermissions(): Promise<void> {
    const { status, ios } = await Notifications.getPermissionsAsync();
    console.log('[Notifications] Permission status:', {
        status,
        iosStatus: ios?.status,
        iosAllowAlert: ios?.allowsAlert,
        iosAllowBadge: ios?.allowsBadge,
        iosAllowSound: ios?.allowsSound,
    });
}
```

### Step 5: Optional - Add debug button in settings (low priority)

Could add a "Debug Notifications" button in settings that calls these utilities. Skipping for now to keep scope minimal.

## Todo List

- [ ] Add debug logging in `scheduleEventNotification`
- [ ] Add `debugGetAllScheduledNotifications` function
- [ ] Add `debugVerifyTriggerDate` function
- [ ] Add `debugCheckPermissions` function
- [ ] Export debug functions from module
- [ ] Test logging appears in Xcode console

## Success Criteria

- Console shows notification scheduling details
- Can verify scheduled notifications via debug function
- iOS-specific permission details logged
- Logs visible in Xcode when running on device

## Notes

- Use `console.log` for debugging - visible in Xcode console
- Consider adding `__DEV__` check to disable in production builds
- Debug functions can be called from React DevTools console

## Next Steps

Proceed to Phase 4 for verification and testing.
