---
title: "Dark Mode Hardcoded Colors Fix"
description: "Fix all hardcoded colors across components for dark mode support"
status: completed
priority: P1
effort: 1h
branch: feat/theme-toggle
tags: [dark-mode, ui, bug-fix]
created: 2026-02-16
---

# Dark Mode Hardcoded Colors Fix

## Problem
Multiple files have hardcoded colors that don't respect dark mode theme.

## Files to Fix

| File | Lines | Issue |
|------|-------|-------|
| `src/app/(tabs)/events.tsx` | 17, 26, 35 | Background, FAB, icon colors |
| `src/app/(tabs)/index.tsx` | 15 | Background color |
| `src/app/event/[id].tsx` | 52, 61, 70 | Delete icon, backgrounds |
| `src/app/+not-found.tsx` | 38 | Link color |
| `src/app/(tabs)/_layout.tsx` | 8, 16 | Tab bar colors (partial fix exists) |
| `src/components/common/Modal.tsx` | 30, 44, 53, 61 | Background, border, text, icon |
| `src/components/common/Header.tsx` | 20, 39, 41, 59 | Background, border, text, icon |
| `src/components/common/Button.tsx` | 46, 74, 79, 82, 83, 90, 93, 96 | All button variants |
| `src/components/events/EventForm.tsx` | 575 | Text color |
| `src/components/calendar/CalendarView.tsx` | 166 | Dot color |

## Already Correct
- `src/constants/theme.ts` - Theme definitions (expected)
- `src/components/calendar/AuspiciousHoursGrid.tsx` - Uses `theme.isDark`
- `src/components/calendar/DayDetailModal.tsx` - Uses `theme.isDark`
- `src/components/events/EventList.tsx` - Uses `useTheme()`
- `src/components/events/EventCard.tsx` - Uses `useTheme()`

## Phases

| Phase | Description | Status | Effort |
|-------|-------------|--------|--------|
| [01](./phase-01-fix-screen-backgrounds.md) | Fix screen backgrounds (events, index, event/[id]) | ✅ done | 15m |
| [02](./phase-02-fix-common-components.md) | Fix Modal, Header, Button components | ✅ done | 30m |
| [03](./phase-03-fix-remaining.md) | Fix EventForm, CalendarView, not-found, _layout | ✅ done | 15m |

## Solution
Use existing `useTheme()` hook across all components.
