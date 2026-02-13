# Phase 4: Verification and Testing

## Overview

- **Priority**: P1
- **Status**: completed
- **Effort**: 15min
- **Depends On**: Phase 2, Phase 3

Verify implementation works on physical iOS device.

## Requirements

### Test Environment
- Physical iOS device (notifications don't work on simulator)
- Development build via EAS (`eas build --profile development`)
- Xcode console for log viewing

## Test Cases

### TC1: Permission Request on App Start

**Steps:**
1. Delete app from device (fresh install)
2. Install development build
3. Launch app

**Expected:**
- iOS permission dialog appears
- Console logs: `[Notifications] Permission request result: granted`

### TC2: Notification Scheduling

**Steps:**
1. Create new event with reminder enabled
2. Set reminder for 1 minute from now (for testing)
3. Check console logs

**Expected:**
- Console logs scheduling details with trigger date
- Console shows notification ID

### TC3: Notification Fires

**Steps:**
1. Schedule notification for near future (e.g., 2 minutes)
2. Background the app
3. Wait for notification

**Expected:**
- Notification banner appears
- Sound plays
- Badge updates

### TC4: Notification Tap Navigation

**Steps:**
1. Tap on received notification

**Expected:**
- App opens
- Navigates to event detail screen
- Console logs: `[Notifications] Navigating to event: {id}`

### TC5: Foreground Notification

**Steps:**
1. Schedule notification
2. Keep app in foreground
3. Wait for notification time

**Expected:**
- Notification banner appears in-app
- Console logs: `[Notifications] Received in foreground`

### TC6: Cold Start from Notification

**Steps:**
1. Force quit app
2. Receive notification
3. Tap notification

**Expected:**
- App launches
- Navigates to event detail after brief delay

## Debug Commands

Run in React DevTools console or add temporary button:

```javascript
// Check all scheduled notifications
import { debugGetAllScheduledNotifications } from '@/services/notifications';
await debugGetAllScheduledNotifications();

// Check permissions
import { debugCheckPermissions } from '@/services/notifications';
await debugCheckPermissions();
```

## Troubleshooting

### Notifications Not Appearing

1. Check permission status via `debugCheckPermissions()`
2. Verify notifications scheduled via `debugGetAllScheduledNotifications()`
3. Check trigger date is in future
4. Verify using development build, not Expo Go

### Permission Denied

1. Go to iOS Settings > App > Notifications
2. Enable notifications manually
3. Or delete and reinstall app

### Navigation Not Working

1. Check console for eventId
2. Verify event exists in store
3. Check router.push syntax

### No Console Logs

1. Open Xcode > Window > Devices and Simulators
2. Select device
3. Open Console (bottom pane)
4. Filter by app name

## Todo List

- [ ] Create development build via EAS
- [ ] Test TC1: Permission request
- [ ] Test TC2: Scheduling logs
- [ ] Test TC3: Notification fires
- [ ] Test TC4: Tap navigation
- [ ] Test TC5: Foreground display
- [ ] Test TC6: Cold start
- [ ] Document any issues found

## Success Criteria

- All test cases pass on physical iOS device
- Console logs provide clear debugging info
- No crashes or memory leaks

## Post-Implementation

If all tests pass:
- Remove excessive debug logging (keep error logs)
- Update documentation if needed
- Consider adding user-facing notification settings
