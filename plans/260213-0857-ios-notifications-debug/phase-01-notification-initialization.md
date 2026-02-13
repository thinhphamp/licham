# Phase 1: Notification Initialization

## Overview

- **Priority**: P1
- **Status**: completed
- **Effort**: 45min

Add notification permission request and handler configuration on app startup.

## Context Links

- [Research: Expo Notifications iOS](research/researcher-01-expo-notifications-ios.md)
- [Current _layout.tsx](../../src/app/_layout.tsx)
- [Current notifications service](../../src/services/notifications/index.ts)

## Key Insights

1. **Permission timing**: Must request on app mount, not on first notification schedule
2. **iOS auth states**: Check `ios.status` explicitly (NOT_DETERMINED, DENIED, AUTHORIZED, PROVISIONAL, EPHEMERAL)
3. **Notification handler**: Already configured in `notifications/index.ts` - just need to ensure module loads early

## Requirements

### Functional
- Request notification permissions on app startup
- Log permission status for debugging
- Configure notification handler before any notifications scheduled

### Non-functional
- Non-blocking - don't delay app startup
- Graceful degradation if permission denied

## Related Code Files

### Modify
- `src/app/_layout.tsx` - Add initialization hook

### Create
- `src/services/notifications/notification-initialization.ts` - Initialization logic (separate for testability)

## Implementation Steps

### Step 1: Create initialization module

Create `src/services/notifications/notification-initialization.ts`:

```typescript
import * as Notifications from 'expo-notifications';
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
  } catch (error) {
    console.error('[Notifications] Initialization error:', error);
  }
}
```

### Step 2: Update _layout.tsx

Add notification initialization in `RootLayout`:

```typescript
import { initializeNotifications } from '@/services/notifications/notification-initialization';

// In RootLayout component, add useEffect:
useEffect(() => {
  initializeNotifications();
}, []);
```

### Step 3: Ensure handler loads early

Import notification handler at top of `_layout.tsx` to ensure `setNotificationHandler` runs:

```typescript
// At top of file, import to trigger side effect
import '@/services/notifications';
```

## Todo List

- [ ] Create `notification-initialization.ts` module
- [ ] Update `_layout.tsx` with initialization useEffect
- [ ] Import notifications service for side effect (handler config)
- [ ] Test permission prompt appears on fresh install
- [ ] Verify console logs show permission status

## Success Criteria

- App prompts for notification permission on first launch
- Console logs permission status (granted/denied)
- No app startup delay or crashes

## Security Considerations

- Permission request is user-initiated (prompted on startup)
- No sensitive data involved
- Falls back gracefully if denied

## Next Steps

After initialization works, proceed to Phase 2 for notification listeners.
