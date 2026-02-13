# Phase 2: Notification Listeners and Tap Handling

## Overview

- **Priority**: P1
- **Status**: completed
- **Effort**: 30min
- **Depends On**: Phase 1

Add listeners to handle notification received (foreground) and response (tap) events.

## Context Links

- [Research: Notification Scheduling](research/researcher-02-notification-scheduling.md)
- [Expo Router Navigation](https://docs.expo.dev/router/reference/navigation/)

## Key Insights

1. **Foreground handling**: `addNotificationReceivedListener` - notification arrives while app open
2. **Background/tap handling**: `addNotificationResponseReceivedListener` - user taps notification
3. **Cleanup required**: Must remove listeners on unmount to prevent memory leaks
4. **Deep linking**: Use `router.push()` to navigate to event detail

## Requirements

### Functional
- Show notifications when app is in foreground (already configured via handler)
- Navigate to event detail when notification tapped
- Handle notifications received while app in background

### Non-functional
- Clean listener cleanup on unmount
- Graceful handling if event no longer exists

## Related Code Files

### Modify
- `src/services/notifications/notification-initialization.ts` - Add listener setup
- `src/app/_layout.tsx` - Use listeners hook

## Implementation Steps

### Step 1: Create listeners hook

Add to `src/services/notifications/notification-initialization.ts`:

```typescript
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

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
        // Handler config (shouldShowAlert: true) handles display
      }
    );

    // Listener for notification tap/response
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('[Notifications] User response:', response);

        const eventId = response.notification.request.content.data?.eventId;
        if (eventId && typeof eventId === 'string') {
          console.log('[Notifications] Navigating to event:', eventId);
          // Navigate to event detail
          router.push(`/event/${eventId}`);
        }
      }
    );

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
```

### Step 2: Update _layout.tsx

Use the listeners hook in `RootLayoutNav`:

```typescript
import { useNotificationListeners } from '@/services/notifications/notification-initialization';

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // Set up notification listeners
  useNotificationListeners();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* ... existing Stack */}
    </ThemeProvider>
  );
}
```

### Step 3: Handle last notification on cold start

Check for notification that launched app:

```typescript
// Add to initialization function
export async function getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
  return await Notifications.getLastNotificationResponseAsync();
}

// In RootLayoutNav useEffect:
useEffect(() => {
  Notifications.getLastNotificationResponseAsync().then((response) => {
    if (response) {
      console.log('[Notifications] App launched from notification:', response);
      const eventId = response.notification.request.content.data?.eventId;
      if (eventId && typeof eventId === 'string') {
        // Delay navigation to ensure router is ready
        setTimeout(() => {
          router.push(`/event/${eventId}`);
        }, 100);
      }
    }
  });
}, []);
```

## Todo List

- [ ] Add `useNotificationListeners` hook
- [ ] Integrate hook in `RootLayoutNav`
- [ ] Add cold start notification handling
- [ ] Test foreground notification display
- [ ] Test notification tap navigates to event
- [ ] Test cold start navigation

## Success Criteria

- Tapping notification opens event detail screen
- Console logs show notification events
- No memory leaks (listeners cleaned up)
- Works on app cold start from notification

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Event deleted after notification scheduled | Low | Check if event exists before navigate |
| Router not ready on cold start | Medium | Add small delay before navigation |

## Next Steps

Proceed to Phase 3 for debugging utilities.
