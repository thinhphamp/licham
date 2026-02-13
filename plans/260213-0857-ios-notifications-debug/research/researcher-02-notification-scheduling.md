# Expo Notification Scheduling Research Report

**Date:** 2026-02-13 | **Focus:** iOS scheduling patterns & debugging

## 1. Expo-Notifications API Overview

### scheduleNotificationAsync()
- **Returns:** Promise resolving to notification identifier (for cancellation tracking)
- **Parameters:**
  - `content` - Notification title, body, data payload
  - `trigger` - Timing specification (Date, null for immediate, or trigger object)
  - `identifier` - Optional unique string for the notification

### Trigger Types Supported
| Type | Use Case | iOS Limitation |
|------|----------|----------------|
| **TIME_INTERVAL** | After N seconds (repeating or once) | Minimum 60s when repeats=true |
| **CALENDAR** | Specific date components (year, month, day, hour, minute) | Native iOS support |
| **DAILY** | Every 24 hours at specific time | Built-in convenience trigger |
| **WEEKLY** | Specific weekdays at time | iOS CalendarTrigger |
| **YEARLY** | Annual recurring dates | iOS CalendarTrigger |
| **MONTHLY** | By calendar date (day of month) | Limited—no direct support |
| **DATE** | Unix timestamp or Date object | Simple timestamp-based |

**Note:** Monthly basis notifications require manual CalendarTriggerInput implementation; no built-in monthly trigger exists.

## 2. iOS-Specific Scheduling Limitations

### Critical Constraints
1. **Minimum 60-second interval:** When `repeats=true` on TimeIntervalTrigger, interval must be ≥60 seconds. Violations silently fail.
2. **Background app limitation:** iOS terminates local notification handlers when app is killed—taps won't navigate or execute code.
3. **Permission granularity:** iOS has 5 auth states: `NOT_DETERMINED`, `DENIED`, `AUTHORIZED`, `PROVISIONAL`, `EPHEMERAL`. Check `ios.status` field explicitly (not root `status`).
4. **Background task frequency:** Apple limits to ~2-3 background notifications/hour.
5. **SDK version variance:** Notification behavior differs across Expo SDK versions (e.g., SDK 52 vs 51 trigger timing bugs).

### Configuration Requirements
- Add `processing` to `UIBackgroundModes` in Info.plist for background fetch
- Register `BGTaskSchedulerPermittedIdentifiers` in app.json for iOS compliance

## 3. Trigger Validation & Calculation

### Helper APIs
- **getNextTriggerDateAsync(trigger):** Calculate when a trigger will next fire. Essential for debugging scheduling issues.
- **getAllScheduledNotificationsAsync():** Audit all active notifications.
- **cancelScheduledNotificationAsync(id):** Clean up by identifier.

### Validation Rules
Date components in trigger objects are range-validated; exceptions thrown for invalid values (e.g., minute not 0–59).

## 4. Debugging Notification Scheduling Issues

### Best Practices
1. **Verify channel creation before scheduling (Android):** Scheduling without a channel causes silent drops.
2. **Use getAllScheduledNotificationsAsync() to audit:** Confirm notifications exist in scheduler.
3. **Call getNextTriggerDateAsync() to verify timing:** Detect misconfigured triggers early.
4. **Test on real iOS device:** Simulators don't replicate background behavior; use Xcode console logs.
5. **Use triggerTaskWorkerForTestingAsync():** Simulate system task triggering for testing.
6. **Check permissions explicitly:** Verify `ios.status` is `AUTHORIZED` or `PROVISIONAL` before scheduling.
7. **Avoid app state in handlers:** Don't rely on global app state inside notification handlers.

### Common Failure Patterns
- Missing 60-second minimum on repeating TimeIntervalTrigger
- Scheduling before channel creation (Android)
- Killed app attempting to handle notification tap
- Invalid date components in CalendarTrigger
- SDK version mismatch (check release notes for trigger bugs)

## 5. Sources & References

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [What You Need to Know About Notifications](https://docs.expo.dev/push-notifications/what-you-need-to-know/)
- [Expo GitHub Issue #28027: Background Scheduling](https://github.com/expo/expo/issues/28027)
- [Expo GitHub Issue #33141: SDK 52 Scheduling Bug](https://github.com/expo/expo/issues/33141)
- [Making Expo Notifications Work (Medium)](https://medium.com/@gligor99/making-expo-notifications-actually-work-even-on-android-12-and-ios-206ff632a845)
- [Background Tasks in Expo (FlexApp 2025 Guide)](https://flexapp.ai/blog/expo-background-tasks-guide)

## Key Takeaways for iOS Debugging

1. **Always verify 60-second minimum** for repeating intervals
2. **Check permissions before scheduling** (iOS 5-state auth)
3. **Use audit APIs** (getAllScheduledNotifications, getNextTriggerDate)
4. **Test on device**, not simulator
5. **Document SDK version** when encountering timing bugs
6. **Avoid app-killed notification handlers**—iOS won't execute them
