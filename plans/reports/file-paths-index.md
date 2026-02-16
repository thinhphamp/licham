# Complete File Index: Notifications & Recurring Events

## All Related Files (Absolute Paths)

### Type Definitions & Schemas
1. `/Users/thinhpham/dev/calendar-app/src/types/event.ts` - Event interface, recurrence modes, types
2. `/Users/thinhpham/dev/calendar-app/src/types/schemas.ts` - Zod validation schemas

### Notification Services
3. `/Users/thinhpham/dev/calendar-app/src/services/notifications/index.ts` - Core notification logic
4. `/Users/thinhpham/dev/calendar-app/src/services/notifications/notification-initialization.ts` - Initialization & listeners

### Utilities & Helpers
5. `/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts` - Event occurrence pattern matching
6. `/Users/thinhpham/dev/calendar-app/src/utils/calendar.ts` - Calendar utilities with recurrence support

### State Management
7. `/Users/thinhpham/dev/calendar-app/src/stores/eventStore.ts` - Event CRUD + notification sync
8. `/Users/thinhpham/dev/calendar-app/src/stores/settingsStore.ts` - Default reminder settings

### UI Components
9. `/Users/thinhpham/dev/calendar-app/src/components/events/EventForm.tsx` - Event creation/editing form

### App Initialization
10. `/Users/thinhpham/dev/calendar-app/src/app/_layout.tsx` - Root layout with notification setup

---

## File Size & Complexity

| File | Lines | Purpose | Complexity |
|------|-------|---------|-----------|
| event.ts | 49 | Type definitions | Low |
| schemas.ts | 39 | Validation | Low |
| notifications/index.ts | 211 | Scheduling & cancellation | High |
| notification-initialization.ts | 102 | Initialization & listeners | Medium |
| recurrence.ts | 91 | Pattern matching | High |
| calendar.ts | 33 | Utilities | Low |
| eventStore.ts | 160 | State management | High |
| settingsStore.ts | ? | Settings | Low |
| EventForm.tsx | 200+ | Form UI | High |
| _layout.tsx | 76 | App setup | Medium |

---

## Quick Access Guide

### To understand notification scheduling:
1. Start: `/Users/thinhpham/dev/calendar-app/src/types/event.ts`
2. Then: `/Users/thinhpham/dev/calendar-app/src/services/notifications/index.ts`
3. Deep dive: `scheduleEventNotification()` function (lines 60-135)

### To understand recurring events:
1. Start: `/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts`
2. Function: `isEventOccurring()` (lines 7-90)
3. Integration: `/Users/thinhpham/dev/calendar-app/src/utils/calendar.ts`

### To understand event lifecycle:
1. Form: `/Users/thinhpham/dev/calendar-app/src/components/events/EventForm.tsx`
2. Storage: `/Users/thinhpham/dev/calendar-app/src/stores/eventStore.ts`
3. Methods: `addEvent()`, `updateEvent()`, `deleteEvent()`

### To understand notification setup:
1. Root layout: `/Users/thinhpham/dev/calendar-app/src/app/_layout.tsx` (lines 26-40)
2. Init: `/Users/thinhpham/dev/calendar-app/src/services/notifications/notification-initialization.ts`
3. Listeners: `useNotificationListeners()` hook (lines 48-101)

---

## Key Function Locations

### Notification Functions
- `scheduleEventNotification()` - notifications/index.ts:60
- `cancelNotification()` - notifications/index.ts:140
- `requestNotificationPermissions()` - notifications/index.ts:45
- `resetBadgeCount()` - notifications/index.ts:156
- `debugGetAllScheduledNotifications()` - notifications/index.ts:164
- `initializeNotifications()` - notification-initialization.ts:10
- `useNotificationListeners()` - notification-initialization.ts:48

### Recurrence Functions
- `isEventOccurring()` - recurrence.ts:7
- `getEventsMapForMonth()` - calendar.ts:9

### Event Store Functions
- `addEvent()` - eventStore.ts:23
- `updateEvent()` - eventStore.ts:47
- `deleteEvent()` - eventStore.ts:77
- `getEventsForLunarDate()` - eventStore.ts:90
- `importEvents()` - eventStore.ts:106

---

## Data Structure Map

```
LunarEvent (src/types/event.ts:15)
├── id: string
├── title: string
├── lunarDay: number (1-30)
├── lunarMonth: number (1-12)
├── lunarYear?: number (single mode only)
├── isLeapMonth: boolean
├── reminderEnabled: boolean
├── reminderDaysBefore: number (0, 1, 2, 3, 7, 14)
├── reminderTime: string ("HH:mm")
├── recurrence?: RecurrenceConfig
│   ├── frequency: number
│   ├── unit: 'day'|'week'|'month'|'year'
│   ├── system: 'solar'|'lunar'
│   ├── endType: 'never'|'on_date'
│   └── endDate?: string
├── notificationId?: string
├── createdAt: string (ISO)
└── updatedAt: string (ISO)
```

---

## Testing Checklist

When testing notification and recurrence features, check these files:

- [ ] Event creation: EventForm.tsx + eventStore.ts
- [ ] Notification scheduling: notifications/index.ts:60-135
- [ ] Single vs recurring: event.ts types + recurrence.ts logic
- [ ] Calendar display: calendar.ts + recurrence.ts
- [ ] Notification listeners: notification-initialization.ts:48-101
- [ ] App initialization: _layout.tsx:26-40
- [ ] Data persistence: eventStore.ts + storage.ts
- [ ] Validation: schemas.ts + EventForm.tsx

