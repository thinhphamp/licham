# Phase 1: Implement Today Button

## Context Links
- Parent: [Overview](./add-go-to-today-button-overview.md)
- Reference: [Code Standards](../../docs/code-standards.md)
- Reference: [Codebase Summary](../../docs/codebase-summary.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-09 |
| Priority | P3 |
| Implementation Status | Pending |
| Review Status | N/A |

Add "Hôm nay" button to calendar header using react-native-calendars renderHeader prop. Button navigates to current date and month.

## Key Insights

1. react-native-calendars supports custom header via renderHeader prop
2. CalendarView already has selectedDate state initialized to today
3. Need to track currentMonth separately for month navigation
4. Theme system provides theme.today color (Vietnamese red #D4382A)
5. Button component exists but may be too large - use inline TouchableOpacity

## Requirements

### Functional
- [ ] Button labeled "Hôm nay" visible in calendar header
- [ ] Pressing button sets selectedDate to today
- [ ] Calendar view scrolls to current month
- [ ] Visual feedback on press

### Non-Functional
- [ ] Minimum touch target 44x44dp for accessibility
- [ ] Works in light and dark modes
- [ ] No layout shifts when button pressed

## Architecture

CalendarView
├── Calendar (react-native-calendars)
│   ├── renderHeader (custom)
│   │   ├── Month Navigation Arrows
│   │   ├── Month/Year Title
│   │   └── "Hôm nay" Button (NEW)
│   └── DayCell components
└── DayDetailModal

## Related Code Files

### Modify
- src/components/calendar/CalendarView.tsx - Add today button and handler

### Reference Only
- src/constants/theme.ts - Theme colors
- src/components/common/Button.tsx - Button patterns

## Implementation Steps

1. Add currentMonth state to track displayed month
2. Create goToToday handler function that:
   - Gets today's date as ISO string
   - Sets selectedDate to today
   - Sets currentMonth to today
3. Add renderHeader prop to Calendar with custom header:
   - Left arrow for previous month
   - Month/year title (centered)
   - "Hôm nay" button (right side)
   - Right arrow for next month
4. Style button using theme colors
5. Add key prop to Calendar using currentMonth to force re-render

## Todo List

- [ ] Add currentMonth state
- [ ] Create goToToday callback
- [ ] Implement custom renderHeader
- [ ] Style "Hôm nay" button
- [ ] Test light/dark mode
- [ ] Verify accessibility (touch target size)

## Success Criteria

- [ ] Button appears in calendar header
- [ ] Pressing button navigates to today's date
- [ ] Current month displayed after press
- [ ] Today's cell highlighted with red border
- [ ] Button visible in both themes
- [ ] Touch target >= 44x44dp

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Custom header breaks calendar navigation | Medium | Test swipe navigation still works |
| Button overlaps month title on small screens | Low | Use responsive padding/sizing |

## Security Considerations

- No security concerns - UI-only change
- No external data or API calls

## Next Steps

After implementation:
1. Run npx expo start to test on simulator
2. Verify in both iOS and Android
3. Test with VoiceOver/TalkBack for accessibility
