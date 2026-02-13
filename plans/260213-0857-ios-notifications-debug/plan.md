---
title: "Fix iOS Notifications Not Working"
description: "Add notification initialization, listeners, and debugging to resolve iOS physical device notification failures"
status: completed
priority: P1
effort: 2h
branch: feat/event-form-ui-updates
tags: [ios, notifications, expo-notifications, bugfix]
created: 2026-02-13
---

# iOS Notifications Debug Plan

## Problem Statement

iOS notifications never fire on physical device. Root causes:
1. **Missing app initialization** - `requestNotificationPermissions()` not called on app start
2. **No notification listeners** - Missing `addNotificationReceivedListener` and `addNotificationResponseReceivedListener`
3. **No tap handling** - Cannot navigate to event when notification tapped
4. **No debugging** - Impossible to verify scheduling success

## Research Summary

- **SDK 52 requirement**: Development builds required (not Expo Go)
- **iOS-specific**: Must check `ios.status` explicitly for 5-state auth
- **60-second minimum**: Repeating intervals must be >= 60s (not applicable here, using DATE trigger)
- **Plugin config**: `expo-notifications` plugin exists in app.json (OK)
- **Project ID**: Configured in app.json extra.eas.projectId (OK)

## Phases

| # | Phase | Status | Effort | Depends On |
|---|-------|--------|--------|------------|
| 1 | [Add notification initialization](phase-01-notification-initialization.md) | completed | 45min | - |
| 2 | [Add notification listeners and tap handling](phase-02-notification-listeners.md) | completed | 30min | Phase 1 |
| 3 | [Add debugging utilities](phase-03-debugging-utilities.md) | completed | 30min | Phase 1 |
| 4 | [Verification and testing](phase-04-verification-testing.md) | completed | 15min | Phase 2, 3 |

## Key Files

- `src/app/_layout.tsx` - Add initialization and listeners
- `src/services/notifications/index.ts` - Add debug functions
- `app.json` - Verify plugin config (already correct)

## Success Criteria

- [x] Permissions requested on app startup
- [x] Notifications fire on physical iOS device
- [x] Tapping notification navigates to event detail
- [x] Debug logging shows scheduling status

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Development build required | Medium | User must run `eas build --profile development` |
| APNs key invalid | High | Check EAS credentials |
| Personal dev team limitation | High | Cannot support push without Apple Developer Program |

## Notes

- Current `expo-notifications` plugin config is minimal but sufficient
- DATE trigger type should work for one-time notifications
- No channel configuration needed for iOS (Android-only)
