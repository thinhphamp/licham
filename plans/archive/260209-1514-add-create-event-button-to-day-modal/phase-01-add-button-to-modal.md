# Phase 1: Add Create Event Button to DayDetailModal

## Context Links

- Parent plan: [Implementation Plan](./implementation-plan-day-modal-create-event-button.md)
- File to modify: `src/components/calendar/DayDetailModal.tsx`
- Reference: `src/components/common/Button.tsx` for styling patterns

## Overview

- **Date**: 2026-02-09
- **Priority**: P2
- **Implementation Status**: Completed
- **Review Status**: Pending
- **Description**: Add a primary action button to DayDetailModal that navigates to event creation

## Key Insights

- DayDetailModal receives `dayInfo` prop with complete lunar date info
- Modal uses `useTheme()` hook for consistent styling
- Header has close button on left, title center, empty placeholder right
- ScrollView content has: date section, canChi section, auspicious hours section
- Best placement: After auspicious hours section (bottom of content) or in header (right side)

## Requirements

### Functional
- Button must be visible and tappable
- Button navigates to `/event/new` route with query params
- Modal closes when navigating away (handled by router)

### Non-Functional
- Follow existing theme patterns (useTheme colors)
- Minimum touch target 44x44dp for accessibility
- Vietnamese label: "Thêm sự kiện"

## Architecture

```
DayDetailModal
├── Header (close | title | [NEW: add button])
├── ScrollView
│   ├── Date Section
│   ├── Can Chi Section
│   └── Auspicious Hours Section
└── [ALT: Bottom action area with add button]
```

## Related Code Files

| File | Action |
|------|--------|
| `src/components/calendar/DayDetailModal.tsx` | Modify - add button + navigation |

## Implementation Steps

1. Import `useRouter` from `expo-router`
2. Import `Ionicons` (already imported)
3. Add `handleCreateEvent` callback that:
   - Calls `onClose()` to dismiss modal
   - Navigates to `/event/new` with query params (lunarDay, lunarMonth, lunarYear, isLeapMonth)
4. Add button in header (replace placeholder `View`) or after auspicious hours section
5. Style button with theme.primary background and white icon/text

## Todo List

- [ ] Import useRouter from expo-router
- [ ] Create handleCreateEvent function with navigation logic
- [ ] Add TouchableOpacity button with "add" icon
- [ ] Apply theme-consistent styling
- [ ] Test navigation with correct params

## Success Criteria

- [ ] Button renders in DayDetailModal
- [ ] Button is visually consistent with app design
- [ ] Tapping button closes modal and navigates to /event/new
- [ ] Route params include: lunarDay, lunarMonth, lunarYear, isLeapMonth

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Navigation breaks modal state | Low | Medium | Close modal before navigate |
| Route params not passed correctly | Low | Low | Verify with console.log |

## Security Considerations

- No sensitive data involved
- Route params are simple numeric values

## Next Steps

- After Phase 1 complete, proceed to Phase 2 to consume params in EventForm
