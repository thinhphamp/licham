---
title: "Add Go to Today Button"
description: "Add button on calendar page to navigate to current date"
status: pending
priority: P3
effort: 30m
branch: main
tags: [ui, calendar, navigation]
created: 2026-02-09
---

# Add "Go to Today" Button

## Overview

Add a "Hôm nay" (Today) button to the calendar view that navigates users to the current date with a single tap. Currently users must manually swipe through months to return to today.

## Phases

| Phase | Description | Status | Progress |
|-------|-------------|--------|----------|
| [Phase 1](./phase-one-today-button-plan.md) | Implement Today button in CalendarView | Completed | 100% |

## Key Files

- `src/components/calendar/CalendarView.tsx` - Main calendar component (modify)
- `src/constants/theme.ts` - Theme colors (reference)
- `src/components/common/Button.tsx` - Button component (reference)

## Approach

Add a small "Hôm nay" button in the calendar header area, positioned to the right of the month navigation. When pressed:
1. Set `selectedDate` to today's date
2. Update calendar's `current` prop to show current month

## Success Criteria

- [ ] Button visible on calendar page header
- [ ] Tapping navigates to current date
- [ ] Calendar scrolls to current month
- [ ] Button uses theme colors (Vietnamese red)
- [ ] Works in both light and dark mode
