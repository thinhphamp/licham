# Bug Fix Guide: Repeating Event Date Shift

## Quick Reference

**Bug Location:** `/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts` (Line 8)
**Issue Type:** Timezone conversion error
**Severity:** High
**Affected Feature:** All repeating events

---

## The One-Line Bug

```typescript
const start = new Date(event.createdAt);  // Line 8 - WRONG
```

Should be one of:

```typescript
// Option A: Derive from lunar date (RECOMMENDED)
const solarStart = lunarToSolar(event.lunarDay, event.lunarMonth, event.lunarYear || new Date().getFullYear(), event.isLeapMonth);
const start = new Date(solarStart.year, solarStart.month - 1, solarStart.day);

// Option B: Use UTC consistently
const utcDate = new Date(event.createdAt);
const start = new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate()));

// Option C: Add explicit startDate field
// (Requires schema change)
```

---

## Detailed Problem Breakdown

### What Happens Now (WRONG)

```
Feb 16, 2026 in Vietnam (UTC+7):
  ├─ Local time: Feb 16, 00:30
  ├─ UTC time: Feb 15, 17:30
  └─ ISO string: "2026-02-15T17:30:45.123Z"

When recurrence.ts processes this:
  1. Parse: new Date("2026-02-15T17:30:45.123Z")
     → UTC Date object representing Feb 15 @ 17:30 UTC
  
  2. Extract components:
     - start.getFullYear() = 2026
     - start.getMonth() = 1
     - start.getDate() = 15
  
  3. Create new date:
     new Date(2026, 1, 15)
     → Feb 15 @ 00:00 LOCAL (Vietnam)
  
  4. Compare with target date:
     - startMidnight = Feb 15 Vietnam
     - targetMidnight = Feb 16 Vietnam
     - NO MATCH!
```

### The Root Cause

JavaScript's Date constructor behaves differently depending on which methods you call:

```typescript
// Method 1: Parse ISO string
new Date("2026-02-15T17:30:45.123Z")
// Interprets as: UTC → Returns date representing that UTC instant

// Method 2: Year/Month/Day constructor  
new Date(2026, 1, 15)
// Interprets as: LOCAL timezone → Returns local midnight

// Mixing these = TIMEZONE MISMATCH
```

---

## Step-by-Step Fix

### Step 1: Identify the Problem

**File:** `/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts`

**Current code (lines 7-24):**
```typescript
export function isEventOccurring(event: LunarEvent, targetDate: Date, targetLunar: { day: number, month: number, year: number, leap: boolean }): boolean {
    const start = new Date(event.createdAt);  // <-- PROBLEM

    // Normalize dates to midnight
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (targetMidnight < startMidnight) return false;
    
    // ... rest of code
}
```

### Step 2: Add Import for Lunar Conversion

At top of file, ensure you have:
```typescript
import { lunarToSolar } from '@/services/lunar';
```

### Step 3: Replace the Bug

**Option A - Use Lunar Date (RECOMMENDED):**

```typescript
export function isEventOccurring(event: LunarEvent, targetDate: Date, targetLunar: { day: number, month: number, year: number, leap: boolean }): boolean {
    // Derive start date from lunar date, not from timestamp
    let lunarStartYear = event.lunarYear;
    
    // For recurring events without explicit lunarYear, use current year
    if (lunarStartYear === undefined) {
        lunarStartYear = new Date().getFullYear();
    }
    
    const solarStart = lunarToSolar(
        event.lunarDay, 
        event.lunarMonth, 
        lunarStartYear, 
        event.isLeapMonth
    );
    
    // Create local midnight from solar date (same timezone as targetDate)
    const startMidnight = new Date(solarStart.year, solarStart.month - 1, solarStart.day);
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (targetMidnight < startMidnight) return false;
    
    // ... rest of code unchanged
}
```

**Option B - Use UTC Consistently:**

```typescript
export function isEventOccurring(event: LunarEvent, targetDate: Date, targetLunar: { day: number, month: number, year: number, leap: boolean }): boolean {
    // Parse createdAt into UTC date
    const utcDate = new Date(event.createdAt);
    
    // Extract UTC components and create UTC midnight
    const startMidnight = new Date(Date.UTC(
        utcDate.getUTCFullYear(), 
        utcDate.getUTCMonth(), 
        utcDate.getUTCDate()
    ));
    
    // For target, also use UTC midnight
    const targetMidnight = new Date(Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate()
    ));

    if (targetMidnight < startMidnight) return false;
    
    // ... rest of code unchanged
}
```

### Step 4: Test the Fix

Create test case:
```typescript
// Test: Create event on Feb 16
const event: LunarEvent = {
    id: 'test-event',
    title: 'Test',
    lunarDay: 16,
    lunarMonth: 2,
    lunarYear: undefined,  // Recurring
    isLeapMonth: false,
    type: 'personal',
    recurrence: {
        frequency: 1,
        unit: 'year',
        system: 'lunar',
        endType: 'never'
    },
    reminderEnabled: false,
    reminderDaysBefore: 0,
    reminderTime: '09:00',
    createdAt: '2026-02-15T17:30:45.123Z',  // UTC equivalent of Feb 16 Vietnam
    updatedAt: '2026-02-15T17:30:45.123Z'
};

// Test: Check if event occurs on Feb 16
const feb16 = new Date(2026, 1, 16);  // Feb 16 local time
const feb16Lunar = { day: 16, month: 2, year: 2026, leap: false };

const occurs = isEventOccurring(event, feb16, feb16Lunar);
console.log('Event occurs on Feb 16?', occurs);  // Should be TRUE

// Test: Event should NOT occur on Feb 15
const feb15 = new Date(2026, 1, 15);
const feb15Lunar = { day: 15, month: 2, year: 2026, leap: false };

const occurs15 = isEventOccurring(event, feb15, feb15Lunar);
console.log('Event occurs on Feb 15?', occurs15);  // Should be FALSE
```

---

## Validation Checklist

After fix, verify:

- [ ] Create repeating event on Feb 16 → appears on Feb 16
- [ ] Recurring events show on correct lunar date
- [ ] Day detail modal lists correct events
- [ ] Calendar dot indicators show on correct dates
- [ ] Solar vs lunar recurrence both work
- [ ] Different timezones tested (if applicable)
- [ ] Old events still display correctly
- [ ] No impact on single-year events

---

## Why This Matters

This bug affects:
1. **Display:** Events show on wrong date in calendar
2. **Navigation:** DayDetailModal shows wrong events
3. **Recurrence:** All recurring events have date issues
4. **UX:** Users can't find their events

The fix is straightforward but critical for app usability.

---

## Related Code Changes

No other files need changes if using Option A (recommended).

If implementation requires additional changes:
- Event schema (`src/types/event.ts`): No changes needed
- Event store (`src/stores/eventStore.ts`): No changes needed
- Calendar utilities (`src/utils/calendar.ts`): No changes needed
- Components using recurrence: Will auto-benefit from fix

