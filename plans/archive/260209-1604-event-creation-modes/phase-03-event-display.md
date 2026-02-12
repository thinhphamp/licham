# Phase 3: Update Event Display Logic

## Context
- Parent: [Plan Overview](./plan.md)
- Depends on:- **Implementation Status**: Completed
- **Review Status**: Pending

## Overview
Update calendar to show single events only in their specific year, while recurring events show every year.

## Key Insights
- Current logic: matches lunarDay + lunarMonth only
- Need to add year check for single events
- Recurring events (lunarYear undefined) show always

## Requirements
- Single events: match day + month + year
- Recurring events: match day + month only
- Visual differentiation (optional, future)

## Related Code Files
- `src/components/calendar/CalendarView.tsx` (modify)
- `src/stores/eventStore.ts` (may need update)

## Implementation Steps

1. Update getEventsForLunarDate in eventStore (if needed):
```typescript
getEventsForLunarDate: (lunarDay: number, lunarMonth: number, lunarYear?: number) => {
    return get().events.filter((e) => {
        const dayMatch = e.lunarDay === lunarDay && e.lunarMonth === lunarMonth;
        // Recurring events always match, single events check year
        if (e.lunarYear === undefined) return dayMatch;
        return dayMatch && e.lunarYear === lunarYear;
    });
}
```

2. Update CalendarView renderDay:
```typescript
const hasEvent = events.some((e) => {
    const dayMatch = e.lunarDay === info.lunar.day && 
                     e.lunarMonth === info.lunar.month &&
                     (!e.isLeapMonth || info.lunar.leap);
    // Check year for single events
    if (e.lunarYear !== undefined) {
        return dayMatch && e.lunarYear === info.lunar.year;
    }
    return dayMatch;
});
```

## Todo
- [x] Update event matching logic in CalendarView
- [x] Update getEventsForLunarDate if needed
- [x] Test with both single and recurring events

## Success Criteria
- [x] Single events show only in their year
- [x] Recurring events show every year
- [x] No regression for existing events
