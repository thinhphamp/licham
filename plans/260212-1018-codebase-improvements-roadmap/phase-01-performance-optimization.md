# Phase 1: Performance Optimization

## Objectives
- Reduce re-renders in the calendar grid.
- Offload expensive calculations from the render loop.

## Tasks

### 1.1 Calendar Day Component Memoization
- [ ] Extract the `renderDay` logic into a new component `DayCellWrapper`.
- [ ] Use `React.memo` for `DayCellWrapper` with a custom comparison function if necessary.
- [ ] Stabilize callbacks like `onPress` using `useCallback`.

### 1.2 Event Pre-calculation Selector
- [ ] Implement a memoized selector in `useEventsStore` or a separate utility.
- [ ] Create a `getEventsMapForMonth(year, month)` function.
- [ ] The map should be a Record `Record<string, boolean>` where key is `YYYY-MM-DD`.
- [ ] Update `CalendarView` to use this map instead of calling `isEventOccurring` for every day during render.

## Code Snippet (Conceptual)

```tsx
// src/components/calendar/DayCellWrapper.tsx
export const DayCellWrapper = React.memo(({ date, state, hasEvent, ...props }) => {
  // Pure UI rendering
}, (prev, next) => {
  return prev.date.dateString === next.date.dateString && 
         prev.state === next.state && 
         prev.hasEvent === next.hasEvent;
});
```

## Success Criteria
- [ ] Profiler shows significant reduction in "Commit" time for CalendarView.
- [ ] Grid remains responsive during fast swiping between months.
