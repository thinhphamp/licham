# Phase 01: Implement Vertical Swipe Gesture

## Context Links
- Parent: [plan.md](./plan.md)
- Target: `src/components/calendar/CalendarView.tsx`
- Docs: [Code Standards](../../docs/code-standards.md)

## Overview
- **Date**: 2026-02-16
- **Priority**: P2
- **Description**: Add PanResponder-based vertical swipe detection to CalendarView
- **Implementation Status**: Pending
- **Review Status**: Not started

## Key Insights
- `react-native-calendars` only supports horizontal swipes via `enableSwipeMonths`
- Must disable horizontal swipes to avoid gesture conflicts
- PanResponder is simpler than react-native-gesture-handler for this use case
- Need threshold (~50px) to distinguish swipes from taps

## Requirements

### Functional
- Swipe UP → next month
- Swipe DOWN → previous month
- Day cell taps must still work
- Smooth transition between months

### Non-Functional
- No additional dependencies
- Gesture threshold: ~50px vertical movement
- No performance impact on calendar rendering

## Architecture

```
┌─────────────────────────────────────┐
│     View (PanResponder wrapper)     │
│  ┌───────────────────────────────┐  │
│  │         Calendar              │  │
│  │   (enableSwipeMonths=false)   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
         │
         ▼
   onPanResponderRelease
         │
    ┌────┴────┐
    │ dy < -50│──▶ goToNextMonth()
    └────┬────┘
         │
    ┌────┴────┐
    │ dy > 50 │──▶ goToPrevMonth()
    └─────────┘
```

## Related Code Files

### Files to Modify
- `src/components/calendar/CalendarView.tsx`

### Key Existing Functions
- `setCurrentMonth(dateString)` - Updates displayed month
- `onMonthChange(month: DateData)` - Callback when month changes

## Implementation Steps

1. **Import PanResponder** from react-native
2. **Create month navigation helpers**:
   ```typescript
   const goToNextMonth = useCallback(() => {
     const date = new Date(currentMonth);
     date.setMonth(date.getMonth() + 1);
     setCurrentMonth(date.toISOString().split('T')[0]);
   }, [currentMonth]);

   const goToPrevMonth = useCallback(() => {
     const date = new Date(currentMonth);
     date.setMonth(date.getMonth() - 1);
     setCurrentMonth(date.toISOString().split('T')[0]);
   }, [currentMonth]);
   ```

3. **Create PanResponder with useMemo**:
   ```typescript
   const panResponder = useMemo(() => PanResponder.create({
     onStartShouldSetPanResponder: () => false,
     onMoveShouldSetPanResponder: (_, gestureState) => {
       // Only capture vertical swipes (not horizontal or taps)
       return Math.abs(gestureState.dy) > 10 &&
              Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
     },
     onPanResponderRelease: (_, gestureState) => {
       const SWIPE_THRESHOLD = 50;
       if (gestureState.dy < -SWIPE_THRESHOLD) {
         goToNextMonth();
       } else if (gestureState.dy > SWIPE_THRESHOLD) {
         goToPrevMonth();
       }
     },
   }), [goToNextMonth, goToPrevMonth]);
   ```

4. **Wrap Calendar with gesture View**:
   ```typescript
   <View {...panResponder.panHandlers}>
     <Calendar
       enableSwipeMonths={false}
       // ... rest of props
     />
   </View>
   ```

5. **Change `enableSwipeMonths` to `false`** (line 116)

## Todo List
- [ ] Import `PanResponder` from react-native
- [ ] Add `goToNextMonth` helper function
- [ ] Add `goToPrevMonth` helper function
- [ ] Create `panResponder` with useMemo
- [ ] Wrap Calendar with gesture-enabled View
- [ ] Set `enableSwipeMonths={false}`
- [ ] Test swipe up/down navigation
- [ ] Test day cell tap still works
- [ ] Verify no gesture conflicts

## Success Criteria
- [ ] Swipe up navigates to next month
- [ ] Swipe down navigates to previous month
- [ ] Day press opens DayDetailModal correctly
- [ ] Header month/year picker still works
- [ ] Arrow buttons still work
- [ ] No visual glitches during swipe

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gesture conflicts with day taps | Medium | High | Use proper threshold and `onMoveShouldSetPanResponder` |
| Performance issues | Low | Medium | Use useMemo for PanResponder |

## Security Considerations
- None (UI-only change)

## Next Steps
- After implementation: Run `npm run lint` and `npm run test`
- Manual testing on iOS and Android
