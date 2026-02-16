---
title: "Calendar Vertical Swipe Navigation"
description: "Add vertical swipe gestures to navigate months (up=next, down=prev)"
status: completed
priority: P2
effort: 1h
branch: main
tags: [ui, gesture, calendar, navigation]
created: 2026-02-16
---

# Calendar Vertical Swipe Navigation

## Overview
Add vertical swipe gesture support to CalendarView for intuitive month navigation:
- **Swipe UP** → Navigate to NEXT month
- **Swipe DOWN** → Navigate to PREVIOUS month

## Current State
- CalendarView uses `react-native-calendars` with `enableSwipeMonths={true}`
- Current swipe is **horizontal** (left/right) - library default
- App has `react-native-reanimated` available (gesture capabilities)
- Month state managed via `currentMonth` + `setCurrentMonth()`

## Implementation Phases

| Phase | Description | Status | Effort |
|-------|-------------|--------|--------|
| [Phase 01](./phase-01-implement-vertical-swipe-gesture.md) | Implement vertical swipe gesture | ✅ Done | 1h |

## Technical Approach
Use React Native's built-in `PanResponder` API (simpler, no extra dependencies):
1. Create PanResponder to detect vertical swipes
2. Wrap Calendar component with gesture-enabled View
3. On swipe up (dy < -threshold): increment month
4. On swipe down (dy > threshold): decrement month
5. Disable horizontal swipes (`enableSwipeMonths={false}`) to avoid conflicts

## Files to Modify
- `src/components/calendar/CalendarView.tsx` - Add PanResponder wrapper

## Success Criteria
- [ ] Swipe up navigates to next month
- [ ] Swipe down navigates to previous month
- [ ] Day press still works correctly
- [ ] No gesture conflicts
- [ ] Smooth UX with ~50px threshold

## Dependencies
- None (using built-in React Native APIs)
