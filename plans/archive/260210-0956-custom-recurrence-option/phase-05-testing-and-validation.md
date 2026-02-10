# Phase 5: Testing and Validation

## Context
- Parent: [Plan Overview](./plan.md)
- Depends on: All previous phases
- Status: pending
- Priority: Medium
- Effort: 15m

## Overview
Verify all recurrence scenarios work correctly, including edge cases like leap months and month-end dates.

## Testing Scenarios

1. **Daily (Solar)**: Event created today should show every day.
2. **Weekly (Solar)**: Frequency 2, unit 'week' should skip every other week.
3. **Monthly (Lunar)**: Should show on the same lunar day every month.
4. **Yearly (Lunar)**: Should show on same lunar day/month every year (legacy compatibility).
5. **Leap Months**: Verify how "Every 2 lunar months" handles the insertion of a leap month.

## Notification Check
Verify `scheduleEventNotification` can handle the new recurrence logic (may require updating the notification service).

## Todo
- [ ] Manual test: Create bi-weekly solar event
- [ ] Manual test: Create monthly lunar event
- [ ] Manual test: Verify legacy events are visible
- [ ] Check notification console logs for scheduling logic

## Success Criteria
- Events appear exactly where they should based on math.
- No "off-by-one" errors in date calculation.
- Application performance remains fluid.
