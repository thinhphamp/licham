# Date Shift Bug: Visual Analysis

## Problem Timeline

```
User Action Timeline (UTC+7 timezone):
=====================================

Feb 16, 2026 (Local Time):
  └─ User creates repeating event
     └─ Form captures: lunarDay=16, lunarMonth=2
     └─ EventStore receives EventFormData
     └─ Calls addEvent()

Event Creation (eventStore.ts:24-25):
  ├─ Event ID: event_1739657445000_xxxxxx
  └─ Timestamp: new Date().toISOString()
     └─ Creates: "2026-02-15T17:30:45.123Z" ← ISO UTC time
                  (Feb 15 @ 17:30 UTC = Feb 16 @ 00:30 Vietnam time)

Storage Phase:
  └─ Event stored with:
     ├─ lunarDay: 16
     ├─ lunarMonth: 2
     ├─ createdAt: "2026-02-15T17:30:45.123Z"  ← KEY TIMESTAMP
     └─ recurrence: { frequency: 1, unit: 'year', system: 'lunar' }

Display Phase (User views calendar on Feb 16):
  ├─ CalendarView checks: getEventsMapForMonth()
  │  └─ For each day, calls: isEventOccurring(event, solarDate, targetLunar)
  │
  └─ isEventOccurring() in recurrence.ts:7-14
     ├─ Parses: const start = new Date(event.createdAt)
     │  └─ "2026-02-15T17:30:45.123Z" → Date object (UTC)
     │
     ├─ Creates local midnight: const startMidnight = new Date(2026, 1, 15)
     │  └─ Interprets as LOCAL date → Feb 15 @ 00:00 Vietnam time
     │  └─ MISMATCH: start is UTC, startMidnight is local!
     │
     └─ Compares: Feb 16 calendar vs Feb 15 stored
        └─ RESULT: "No match" → Event hidden
```

## The Core Bug

```javascript
// BUGGY CODE (recurrence.ts:8-12)
const start = new Date(event.createdAt);  
// For "2026-02-15T17:30:45.123Z":
// - Parsed as: Feb 15 UTC @ 17:30
// - In memory: represents that UTC instant

const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
// For start (Feb 15 UTC):
// - start.getFullYear() = 2026
// - start.getMonth() = 1 (Feb in JS)
// - start.getDate() = 15
// - NEW DATE CREATED: Feb 15 @ 00:00 LOCAL TIME (Vietnam)
// - But the original `start` was Feb 15 UTC (which is Feb 16 Vietnam!)

// RESULT: Two different dates being compared
// - startMidnight = Feb 15 Vietnam local
// - targetMidnight = Feb 16 Vietnam local
// - NO MATCH even though they refer to same calendar day
```

## How It Should Work

```javascript
// CORRECT APPROACH
const utcDate = new Date(event.createdAt);

// Use UTC functions consistently
const startMidnight = new Date(Date.UTC(
    utcDate.getUTCFullYear(), 
    utcDate.getUTCMonth(), 
    utcDate.getUTCDate()
));

// Now startMidnight is in UTC: Feb 15 @ 00:00 UTC
// Which correctly represents: Feb 15 UTC (= Feb 15 17:00 Vietnam)
// But should really be: Feb 16 Vietnam (= Feb 16 00:00 Vietnam)
```

## The Real Issue

The `createdAt` field is fundamentally wrong for determining event occurrence.

**What's stored:** When event was created (timestamp)
**What's needed:** What calendar date the event belongs to

For a repeating event created on Feb 16 Vietnam time:
- The calendar date is: Feb 16 (lunar: day 16, month 2)
- The timestamp is: "2026-02-15T17:30:45.123Z" (UTC equivalent)

**The bug:** Using timestamp to derive calendar date causes timezone shift.

## Fix Approach

Instead of using `createdAt`, use the actual lunar date:

```typescript
// For lunar recurrence, derive start from lunar date
function lunarToSolarDate(lunarDay: number, lunarMonth: number, lunarYear: number, isLeap: boolean): Date {
    const solar = lunarToSolar(lunarDay, lunarMonth, lunarYear, isLeap);
    return new Date(solar.year, solar.month - 1, solar.day);
}

// In isEventOccurring():
const eventStartDate = lunarToSolarDate(event.lunarDay, event.lunarMonth, lunarYear, event.isLeapMonth);
const startMidnight = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
```

## Files Involved in Bug Chain

```
User creates event
    ↓
EventForm.tsx (line 122) → onSubmit(data)
    ↓
event/new.tsx (line 33) → addEvent(data)
    ↓
eventStore.ts (line 23-44) → Creates event with createdAt timestamp
    ↓
CalendarView.tsx (line 58-61) → getEventsMapForMonth()
    ↓
calendar.ts (line 9-32) → Checks isEventOccurring() for each day
    ↓
recurrence.ts (line 7-14) → BUG: Uses createdAt to determine start date
    ↓
Calendar shows event on WRONG DATE (one day earlier)
```

## Impact Summary

| Component | File | Lines | Issue |
|-----------|------|-------|-------|
| Recurrence Logic | `recurrence.ts` | 7-14 | Uses `createdAt` instead of actual event date |
| Event Creation | `eventStore.ts` | 23-31 | Stores timestamp correctly, but stores it in wrong field |
| Calendar Map | `calendar.ts` | 19 | Calls buggy `isEventOccurring()` |
| Day Detail Modal | `DayDetailModal.tsx` | 48-59 | Filters via buggy function, events don't appear |

---

**Timeline Analysis Complete**
