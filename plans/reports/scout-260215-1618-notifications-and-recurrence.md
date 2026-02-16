# Scout Report: Notifications & Recurring Events

## Summary

Found 10 core files handling notifications and recurring event logic in the React Native Expo calendar app. System uses single-shot notifications for one-time events but does NOT schedule recurring notifications - instead it calculates whether an event occurs on each calendar date using recurrence logic.

**Key architectural insight:** Recurring events are calculated dynamically (not pre-scheduled), allowing flexible pattern matching across lunar and solar calendars.

---

## Core Files & Locations

### 1. Type Definitions

**File:** `/Users/thinhpham/dev/calendar-app/src/types/event.ts`

Defines event structure with recurrence modes:
- `RecurrenceMode`: 'single' | 'recurring'
- `RecurrenceUnit`: 'day' | 'week' | 'month' | 'year'
- `DateSystem`: 'solar' | 'lunar'
- `RecurrenceConfig`: frequency, unit, system, endType, endDate

```typescript
export interface LunarEvent {
    id: string;
    title: string;
    lunarDay: number;
    lunarMonth: number;
    lunarYear?: number;         // Defined for single, undefined for recurring
    isLeapMonth: boolean;
    reminderEnabled: boolean;
    reminderDaysBefore: number;
    reminderTime: string;       // "HH:mm" format
    recurrence?: RecurrenceConfig;  // Only for recurring
    notificationId?: string;    // Expo-notifications ID
}
```

### 2. Notification Scheduling

**File:** `/Users/thinhpham/dev/calendar-app/src/services/notifications/index.ts`

Core notification logic:

#### Key Functions:

**`scheduleEventNotification(event: LunarEvent)`** - Main scheduling function:
- Converts lunar to solar date (handles recurring by checking multiple years)
- Calculates trigger date: `event date - reminderDaysBefore - reminderTime`
- For recurring events (no `lunarYear`), if trigger date passed, tries next year
- Schedules single DATE-type notification
- Returns Expo notification ID

```typescript
// Simplified logic for recurring vs single:
const targetYear = event.lunarYear ?? currentYear;  // Year = undefined for recurring
let solar = lunarToSolar(event.lunarDay, event.lunarMonth, targetYear, event.isLeapMonth);

// If trigger date passed AND recurring (no lunarYear), try next year
if (triggerDate <= new Date() && !event.lunarYear) {
    solar = lunarToSolar(..., targetYear + 1, ...);
    triggerDate = calculateTriggerDate(solar);
}
```

**`cancelNotification(notificationId)`** - Cancels by Expo ID

**`cancelAllNotifications()`** - Clears all scheduled notifications

**`resetBadgeCount()`** - Resets app icon badge to 0

**`debugGetAllScheduledNotifications()`** - Lists all active notifications

### 3. Notification Initialization

**File:** `/Users/thinhpham/dev/calendar-app/src/services/notifications/notification-initialization.ts`

**`initializeNotifications()`:**
- Requests iOS permissions (alert, badge, sound)
- Resets badge on app start

**`useNotificationListeners()` hook:**
- Listens for foreground notifications
- Listens for tap responses → navigates to `/event/{eventId}`
- Handles cold start (app launched from notification)
- Cleans up subscriptions on unmount

### 4. Recurrence Matching Logic

**File:** `/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts`

**`isEventOccurring(event, targetDate, targetLunar)`** - Determines if recurring event occurs on date:

**Single Mode Check:**
```typescript
if (event.lunarYear !== undefined) {
    return targetLunar matches exact date;
}
```

**Legacy Recurring (no recurrence config):** Yearly lunar recurrence

**Modern Recurring:** Supports 4 patterns:

1. **Solar System:**
   - Day: `diffDays % frequency === 0`
   - Week: `diffDays % (frequency * 7) === 0`
   - Month: Same day-of-month, `monthsDiff % frequency === 0`
   - Year: Same day/month, `yearsDiff % frequency === 0`

2. **Lunar System:**
   - Day/Week: Absolute time diff (days)
   - Month: Lunar day match, approximated lunar months
   - Year: Lunar day/month/leap match, `yearsDiff % frequency === 0`

### 5. Event Store (State Management)

**File:** `/Users/thinhpham/dev/calendar-app/src/stores/eventStore.ts`

Zustand store with notification lifecycle:

**`addEvent(data)`:**
- Creates event with ID and timestamps
- If `reminderEnabled`, calls `scheduleEventNotification()`
- Stores returned notification ID

**`updateEvent(id, data)`:**
- Cancels old notification
- Reschedules if reminder enabled
- Clears `notificationId` if disabled

**`deleteEvent(id)`:**
- Cancels notification before deletion

**`importEvents(events)`:**
- Cancels all current notifications
- Re-schedules all imported events with reminders
- Updates notification IDs

**Migration (v0→v1):**
```typescript
// Legacy events without recurrence config auto-converted
if (lunarYear === undefined && !recurrence) {
    recurrence = { frequency: 1, unit: 'year', system: 'lunar' }
}
```

### 6. Event Form UI

**File:** `/Users/thinhpham/dev/calendar-app/src/components/events/EventForm.tsx`

Form handles both modes:

**Recurrence Mode Toggle:**
- Single: Displays year picker, sets `lunarYear`
- Recurring: Hides year, shows recurrence config

**Recurrence Config UI:**
- Frequency input
- Unit selector: Day, Week, Month, Year
- System selector: Lunar, Solar
- End Type: Never / On Date
- End Date picker (if on_date)

**Reminder Settings:**
- Enable/disable toggle
- Days before: [0, 1, 2, 3, 7, 14]
- Time input: "HH:mm" format

### 7. Calendar Utilities

**File:** `/Users/thinhpham/dev/calendar-app/src/utils/calendar.ts`

**`getEventsMapForMonth(events, year, month)`:**
- Iterates all days in solar month
- For each day, gets lunar info
- Calls `isEventOccurring()` for all events
- Returns `Record<dateString, boolean>` for efficient calendar rendering

### 8. Validation Schemas

**File:** `/Users/thinhpham/dev/calendar-app/src/types/schemas.ts`

Zod validation:
- Ensures `recurrenceMode === 'recurring'` requires `recurrence` config
- Validates `reminderTime` format: `HH:mm` regex
- Validates lunar dates, frequency > 0, endDate string format

### 9. Initialization in Root Layout

**File:** `/Users/thinhpham/dev/calendar-app/src/app/_layout.tsx`

Startup sequence:
1. `initializeStorage()`
2. `initializeNotifications()`
3. Reset badge on app resume
4. Setup notification listeners via `useNotificationListeners()` hook

### 10. Settings Store (Default Reminders)

**File:** `/Users/thinhpham/dev/calendar-app/src/stores/settingsStore.ts`

Stores user defaults:
- `reminderDaysBefore`: Default reminder offset
- `reminderTime`: Default reminder time (e.g., "09:00")

Used to pre-fill event form.

---

## Notification Behavior: Single vs Recurring

### One-Time Events (`recurrenceMode === 'single'`)

- `lunarYear` is set to specific year
- Notification scheduled for `year/month/day - reminderDaysBefore @ reminderTime`
- Notification fires ONCE, never repeats
- Once fired, event is "done"

### Recurring Events (`recurrenceMode === 'recurring'`)

- `lunarYear` is undefined
- `recurrence` config contains pattern rules
- **Notification is scheduled for NEXT occurrence only**
- When viewed on calendar, `isEventOccurring()` dynamically checks if event applies
- **No individual notifications per recurrence** - only one scheduled per event

Example:
- Event: "Birthday" every lunar year on 5/15
- When created Dec 15, 2024: Schedules notification for next 5/15 (May 16, 2025)
- When May 15, 2025 arrives, notification fires
- When user views calendar in June 2026, `isEventOccurring()` still returns true for June 15, 2026

---

## Data Flow Diagram

```
Event Creation
    ↓
EventForm collects data (recurrenceMode, recurrence, reminder settings)
    ↓
validateSchema() → ZOD validation
    ↓
useEventsStore.addEvent()
    ↓
├─ reminderEnabled? YES → scheduleEventNotification()
│  ├─ Convert lunar→solar
│  ├─ Calculate trigger date (date - days + time)
│  ├─ Schedule via Notifications.scheduleNotificationAsync()
│  └─ Store returned notification ID
│
└─ Store event in MMKV
    ↓
Calendar View
    ↓
getEventsMapForMonth() → for each date:
    ├─ getDayInfo() → lunar equivalent
    └─ isEventOccurring(event, solarDate, lunarDate)
        ├─ Single mode? Match exact year
        └─ Recurring? Match pattern rules
    ↓
Render event indicator on matching dates
```

---

## Key Implementation Details

### Recurring Event Scheduling Strategy

**Current approach:** Only schedule ONE notification per recurring event
- Pros: Simple, scales well, respects user's single reminder preference
- Cons: User only gets notified once per occurrence cycle

**How it adapts to next occurrence:**
1. Check if trigger date is in past
2. If past AND event has no `lunarYear` (recurring), try next year
3. Only schedule if trigger is future

### Lunar vs Solar Recurrence

**Solar:** Based on absolute days
- "Every 2 weeks" = recurring every 14 days from creation date

**Lunar:** Based on lunar calendar rules
- "Every lunar year on 5/15" = matches 5/15 every lunar year (not every 365 days)
- Handles leap months correctly

### Leap Month Handling

- Events can be on regular month OR leap month (5th lunar month vs 5th leap month)
- `isLeapMonth` boolean distinguishes
- Calendar rendering accounts for this via `getDayInfo().lunar.leap`

---

## File Dependencies Map

```
Event Creation Flow:
  EventForm.tsx
    ├─ EventFormDataSchema (validation)
    ├─ types/event.ts (types)
    └─ stores/eventStore.ts (add event)
        ├─ services/notifications/index.ts (schedule)
        └─ services/lunar (convert lunar→solar)

Calendar Display Flow:
  Calendar Component
    ├─ utils/calendar.ts (getEventsMapForMonth)
    ├─ utils/recurrence.ts (isEventOccurring)
    ├─ services/lunar (getDayInfo)
    └─ stores/eventStore.ts (get events)

Notification Flow:
  app/_layout.tsx
    ├─ notification-initialization.ts (init + listeners)
    ├─ services/notifications/index.ts (schedule/cancel)
    └─ expo-notifications (platform bridge)
```

---

## Unresolved Questions

- Does app reschedule recurring notifications on app resume/cold start? (Not visible in code)
- How are past-due recurring events handled? Are they silently skipped or shown in history?
- Is there logic to handle timezone changes for scheduled notifications?
