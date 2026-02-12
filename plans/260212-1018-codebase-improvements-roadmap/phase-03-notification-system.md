# Phase 3: Notification System

## Objectives
- Ensure notifications are always scheduled for the upcoming occurrence.
- Enable direct navigation from notifications to event details.

## Tasks

### 3.1 Background Notification Refresh
- [ ] Implement a `refreshNotifications()` function in `notificationService`.
- [ ] This function should:
    - Clear all scheduled notifications.
    - Loop through all enabled events in `eventStore`.
    - Schedule the *next* occurrence (solar date) for each.
- [ ] Call `refreshNotifications()` on App Startup (`_layout.tsx`).

### 3.2 Notification Interaction & Deep Linking
- [ ] Configure `expo-router` linking in `app.json`.
- [ ] Implement a notification listener in the root layout.
- [ ] When a notification is tapped:
    - Extract `eventId` from the data payload.
    - Navigate to `/event/[id]`.

## Code Snippet (Conceptual)

```typescript
// src/services/notifications/index.ts
export async function refreshNotifications() {
    const events = useEventsStore.getState().events;
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const event of events) {
        if (event.reminderEnabled) {
            await scheduleEventNotification(event);
        }
    }
}
```

## Success Criteria
- [ ] Simulated late-year events correctly schedule for the following year.
- [ ] Tapping a notification opens the correct event card.
