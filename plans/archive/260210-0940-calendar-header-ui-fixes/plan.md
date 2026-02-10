---
title: "Calendar Header UI Fixes"
description: "Fix today button overflow and add month/year picker"
status: completed
priority: P1
effort: 2h
branch: main
tags: [bugfix, feature, ui, calendar]
created: 2026-02-10
---

# Calendar Header UI Fixes

## Overview
Two issues identified from screenshot:
1. **Bug**: "Hôm nay" button clipped/overflow (shows "Hôm na")
2. **Feature**: Click month header to open month/year picker

## Current State
- Header uses `justifyContent: 'space-between'` but calendar container constrains width
- Month text not tappable - only arrows for navigation

## Target State
- Today button fully visible within bounds
- Tapping "February 2026" opens month/year picker modal

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | [Fix Today Button Overflow](./phase-01-fix-today-button-overflow.md) | completed | 30m |
| 2 | [Add Month/Year Picker](./phase-02-add-month-year-picker.md) | completed | 1.5h |

## Key Files
- `src/components/calendar/CalendarView.tsx` - Main calendar component
- New: `src/components/calendar/MonthYearPicker.tsx` - Picker modal

## Success Criteria
- [x] "Hôm nay" button fully visible on all screen sizes
- [x] Tapping month header opens picker
- [x] User can select any month/year from picker
- [x] Calendar navigates to selected month
