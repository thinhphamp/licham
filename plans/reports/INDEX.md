# Bug Investigation Reports Index

## Issue: Repeating Event Date Shift Bug
**Status:** Investigated and documented  
**Date:** Feb 15, 2026  
**Severity:** High

---

## Report Files

### 1. INVESTIGATION_SUMMARY.txt (START HERE)
**Quick reference for the entire investigation**

Contains:
- Executive summary of the bug
- Root cause explanation
- File locations and line numbers
- Impact assessment
- Reproduction steps
- Recommendations

**Best for:** Quick understanding of the bug and fix needed

---

### 2. scout-260215-2117-repeating-event-date-shift-bug.md (DETAILED ANALYSIS)
**Comprehensive technical analysis**

Contains:
- Issue summary
- Root cause analysis with code examples
- Affected code sections with line numbers
- Impact analysis
- Recommended fix strategies (3 options)
- Code snippets showing buggy vs. correct implementation
- Timezone context
- Test case for reproduction

**Best for:** Understanding the technical details and all fix options

---

### 3. bug-analysis-timeline.md (VISUAL BREAKDOWN)
**Step-by-step timeline of how the bug occurs**

Contains:
- User action timeline
- Event creation flow
- Storage phase details
- Display phase with bug manifestation
- Core bug explanation with code
- How it should work (correct approach)
- Real issue diagnosis
- Fix approach suggestion
- File involvement chain
- Impact summary table

**Best for:** Understanding the bug flow visually

---

### 4. bug-fix-guide.md (IMPLEMENTATION GUIDE)
**Step-by-step guide to fix the bug**

Contains:
- Quick reference (bug location and fix options)
- Detailed problem breakdown
- Root cause explanation
- Step-by-step fix instructions
- Two implementation approaches with full code
- Test case code to verify fix
- Validation checklist
- Why the fix matters
- Related code changes

**Best for:** Implementing the fix in code

---

## Quick Navigation

### I want to understand the bug in 5 minutes
→ Read: **INVESTIGATION_SUMMARY.txt**

### I want full technical details
→ Read: **scout-260215-2117-repeating-event-date-shift-bug.md**

### I want to see how the bug happens visually
→ Read: **bug-analysis-timeline.md**

### I want to fix it
→ Read: **bug-fix-guide.md**

### I want all of the above
→ Read in order: Summary → Timeline → Detailed Analysis → Fix Guide

---

## Key Findings Summary

| Aspect | Details |
|--------|---------|
| **Bug Location** | `/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts`, Line 8 |
| **Function** | `isEventOccurring()` |
| **Issue** | Timezone mismatch: mixing UTC and local date parsing |
| **Root Cause** | `new Date(event.createdAt)` creates UTC date, then components extracted as if local |
| **Impact** | All repeating events show on wrong date (1 day earlier) |
| **Severity** | High - affects all recurring events |
| **Timezone** | Affects UTC+ timezones like Vietnam (UTC+7) |
| **Fix Type** | Simple line replacement with 2 recommended options |

---

## Bug Trace

```
Event Creation
    ↓ (stores createdAt in UTC)
Event Storage
    ↓ (createdAt = "2026-02-15T17:30:45.123Z")
Calendar Display Check
    ↓ (calls isEventOccurring())
BUG: Timezone Mismatch
    ↓ (interprets UTC as local, loses 7 hours)
Wrong Date Calculation
    ↓ (Feb 15 instead of Feb 16)
Event Hidden
```

---

## Files Mentioned in Reports

### Critical (Must Fix)
- `/Users/thinhpham/dev/calendar-app/src/utils/recurrence.ts` - **THE BUG**

### Impacted (Depends on Bug Fix)
- `/Users/thinhpham/dev/calendar-app/src/utils/calendar.ts`
- `/Users/thinhpham/dev/calendar-app/src/components/calendar/DayDetailModal.tsx`
- `/Users/thinhpham/dev/calendar-app/src/stores/eventStore.ts`

### Correct (Not Buggy)
- `/Users/thinhpham/dev/calendar-app/src/services/lunar/converter.ts`
- `/Users/thinhpham/dev/calendar-app/src/services/lunar/newMoon.ts`

---

## How to Use These Reports

1. **Start with INVESTIGATION_SUMMARY.txt** for a quick overview
2. **If you need to fix it**, go to bug-fix-guide.md and follow steps 1-4
3. **If you need to understand it deeply**, read all reports in order
4. **If you're debugging related issues**, reference the file locations and line numbers

---

## Recommended Fix

**Option A (Recommended):** Use lunar date as start point instead of createdAt

```typescript
const solarStart = lunarToSolar(
  event.lunarDay, 
  event.lunarMonth, 
  event.lunarYear || new Date().getFullYear(), 
  event.isLeapMonth
);
const start = new Date(solarStart.year, solarStart.month - 1, solarStart.day);
```

**Why:** Most reliable for lunar calendar app, no data migration needed

See bug-fix-guide.md for Option B and full implementation details.

---

## Contact & Questions

For implementation questions, refer to:
- Code snippets in all reports
- Line numbers provided for every issue
- Test cases in bug-fix-guide.md

---

**Investigation completed:** Feb 15, 2026
**Report status:** Complete and ready for implementation
