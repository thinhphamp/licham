# Bug Investigation Report: Repeating Event Date Shift Bug

## Issue Summary
Creating a repeating event on Feb 16, 2026 shows the event on Feb 15, 2026 instead.

## Root Cause Analysis

### Critical Bug Location: `/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts` (Line 8)

**The Problem:**
```typescript
export function isEventOccurring(event: LunarEvent, targetDate: Date, targetLunar: { day: number, month: number, year: number, leap: boolean }): boolean {
    const start = new Date(event.createdAt);  // <-- BUG HERE
    
    // Normalize dates to midnight
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
```

**Why it fails:**
When `event.createdAt` is stored as an ISO string (e.g., "2026-02-16T10:30:45.123Z"), parsing it with `new Date()` creates a Date object in UTC. However, the subsequent line normalizes it to midnight **in the local timezone**:

```javascript
new Date(start.getFullYear(), start.getMonth(), start.getDate())
```

This creates an asymmetry:
1. `start` is interpreted as UTC: "2026-02-16T10:30:45Z" → Feb 16 UTC
2. Constructor creates local midnight: `new Date(2026, 1, 16)` → Feb 16 local midnight
3. If user is in UTC+7 timezone, the UTC date gets shifted back by 7 hours when converted to local

### Flow of Bug in Event Creation

1. **Event Creation** (`/Users/thinhpham/dev/calendar-app/src/stores/eventStore.ts`, Line 25):
```typescript
const now = new Date().toISOString();  // Stores "2026-02-16T03:30:45.123Z" for UTC+7
```

2. **Event Display Check** (`/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts`, Line 8):
```typescript
const start = new Date(event.createdAt);  // Parse "2026-02-16T03:30:45.123Z"
const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
// In UTC+7: Feb 16 UTC → Feb 15 local time (because 03:30 UTC is Feb 15 in UTC+7)
```

3. **Comparison Fails**: 
   - Event created on Feb 16 is marked as Feb 15 in the system
   - When displaying on Feb 16, the `isEventOccurring()` function compares Feb 16 (current date) against Feb 15 (stored date)
   - For single-day events, this exact match fails, hiding the event

## Affected Code Sections

### 1. Event Recurrence Logic
**File:** `/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts`
**Lines:** 7-14, 38-49 (solar recurrence for day/week/month/year)
**Issue:** `createdAt` is used to determine recurrence start date but is incorrectly converted from ISO string to local time

### 2. Event Store
**File:** `/Users/thinhpham/dev/calendar-app/src/stores/eventStore.ts`
**Lines:** 23-31
**Stores:** `createdAt: now` where `now = new Date().toISOString()`
**Impact:** ISO string stored correctly, but interpreted incorrectly in recurrence logic

### 3. Calendar Event Map Building
**File:** `/Users/thinhpham/dev/calendar-app/src/utils/calendar.ts`
**Lines:** 9-31
**Calls:** `isEventOccurring()` which has the timezone bug

### 4. Day Detail Modal
**File:** `/Users/thinhpham/dev/calendar-app/src/components/calendar/DayDetailModal.tsx`
**Lines:** 48-59
**Impact:** Events filtered via `isEventOccurring()` - buggy dates cause events to not appear

## Lunar Conversion Functions (Not Directly Responsible)

**File:** `/Users/thinhpham/dev/calendar-app/src/services/lunar/converter.ts`

These functions are correct:
- `lunarToSolar()` (Lines 147-185): Correctly converts lunar dates to solar
- `solarToLunar()` (Lines 91-142): Correctly converts solar to lunar
- Timezone is properly handled in `newMoon.ts` with constant `TIMEZONE = 7`

The bug is NOT in lunar conversion but in how `createdAt` timestamp is used.

## Impact Analysis

### Affected Scenarios
1. **Single-day repeating events**: Event created on Feb 16 doesn't display on Feb 16
2. **Any recurrence pattern**: Day-based recurrence calculations fail
3. **Event creation near timezone boundaries**: More pronounced in timezones offset from UTC

### Not Affected
- **Lunar-based recurring events**: Those use `lunarDay`, `lunarMonth`, `isLeapMonth` fields (correct)
- **Recurrence calculation logic itself**: Algorithm is sound, just fed wrong start date

## Recommended Fix Strategy

Replace `event.createdAt` with the actual event date as the recurrence start point:

### Option 1: Use Lunar Date as Start (Preferred)
For lunar-based events, derive start date from `lunarDay`, `lunarMonth`, `lunarYear` fields instead of `createdAt`.

### Option 2: Use Solar Date 
Add a dedicated `startDate` field to `LunarEvent` for the actual date the event should start on.

### Option 3: Parse Timezone-Aware
Properly parse ISO string without timezone shift:
```typescript
const utcDate = new Date(event.createdAt);
const startMidnight = new Date(Date.UTC(
    utcDate.getUTCFullYear(), 
    utcDate.getUTCMonth(), 
    utcDate.getUTCDate()
));
```

## Code Snippets to Review

**Recurrence Check (BUGGY):**
```typescript
// /Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts:7-14
export function isEventOccurring(event: LunarEvent, targetDate: Date, targetLunar: { day: number, month: number, year: number, leap: boolean }): boolean {
    const start = new Date(event.createdAt);  // <-- TIMEZONE BUG
    
    // Normalize dates to midnight
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    if (targetMidnight < startMidnight) return false;
```

**Event Creation (CORRECT BUT MISUSED):**
```typescript
// /Users/thinhpham/dev/calendar-app/src/stores/eventStore.ts:23-31
addEvent: async (data: EventFormData) => {
    const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();  // <-- ISO string correct here
    
    const event: LunarEvent = {
        ...data,
        id,
        createdAt: now,  // <-- Stored correctly
        updatedAt: now,
    };
```

**Calendar Event Map (USING BUGGY FUNCTION):**
```typescript
// /Users/thinhpham/dev/calendar-app/src/utils/calendar.ts:9-24
export function getEventsMapForMonth(events: LunarEvent[], year: number, month: number): Record<string, boolean> {
    const eventsMap: Record<string, boolean> = {};
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const solarDate = new Date(year, month - 1, day);
        const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        const info = getDayInfo(day, month, year);
        
        const hasEvent = events.some(event => isEventOccurring(event, solarDate, {
            day: info.lunar.day,
            month: info.lunar.month,
            year: info.lunar.year,
            leap: info.lunar.leap
        }));
```

## Timezone Context
- Vietnam timezone: GMT+7 (constant in `/Users/thinhpham/dev/calendar-app/src/services/lunar/converter.ts:4`)
- System should use this consistently throughout event handling
- Bug occurs because recurrence logic doesn't respect this timezone

## Related Files (For Context)
- `/Users/thinhpham/dev/calendar-app/src/types/event.ts` - Event type definitions
- `/Users/thinhpham/dev/calendar-app/src/components/events/EventForm.tsx` - Event form submission
- `/Users/thinhpham/dev/calendar-app/src/app/event/new.tsx` - New event page routing
- `/Users/thinhpham/dev/calendar-app/src/components/calendar/CalendarView.tsx` - Main calendar display

## Test Case for Bug Reproduction
1. Device timezone: Any UTC+ timezone (e.g., UTC+7)
2. Create recurring event on Feb 16, 2026
3. Expected: Event shows on Feb 16
4. Actual: Event shows on Feb 15 (or previous day depending on offset)

