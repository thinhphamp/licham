# Phase 3: Update Event Store Logic

## Context
- Parent: [Plan Overview](./plan.md)
- Depends on: Phase 1, 2
- Status: completed
- Priority: High
- Effort: 30m

## Overview
Update the matching logic in `eventStore.ts` and `CalendarView.tsx` to handle frequency and date systems.

## The "Recurrence Solver" Problem
We move from simple equality (`lunarDay === x`) to a calculated check.

### Proposed Logic:
- **Solar Recurrence**:
  - Convert start date (createdAt) and current date to timestamps.
  - Check if `(current - start) % interval_in_ms === 0`.
- **Lunar Recurrence (Monthly/Yearly)**:
  - Monthly: `currentLunarDay === startLunarDay && (lunarMonthsDiff % frequency === 0)`.
  - Yearly: `currentLunarDay === startLunarDay && currentLunarMonth === startLunarMonth && (lunarYearsDiff % frequency === 0)`.

## Implementation Steps

1. **Utility Function**:
   Create `src/utils/recurrence.ts` to host `isEventOccurring(event, date)` logic.

2. **Update Store**:
   Update `getEventsForLunarDate` to use the new utility.

3. **Update CalendarView**:
   Update `renderDay` to call the solver instead of checking fields directly.

## Related Code Files
- `src/stores/eventStore.ts` (modify)
- `src/components/calendar/CalendarView.tsx` (modify)
- New: `src/utils/recurrence.ts` 

## Todo
- [ ] Implement `isEventOccurring` logic for Solar
- [ ] Implement `isEventOccurring` logic for Lunar (Month/Year)
- [ ] Integration into Store get method
- [ ] Integration into UI render logic

## Success Criteria
- Daily/Weekly solar events show up correctly.
- Bi-yearly lunar events show up only on even/odd years.
- Performance remains high (optimized solver).
