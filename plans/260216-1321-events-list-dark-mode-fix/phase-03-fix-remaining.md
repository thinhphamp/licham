# Phase 03: Fix Remaining Components

## Context
- Parent: [plan.md](./plan.md)

## Overview
- **Priority**: P2
- **Status**: pending
- **Description**: Fix remaining hardcoded colors

## Files to Modify

### 1. `src/components/events/EventForm.tsx`
**Issue (line 575):**
- Text: `color: '#FFFFFF'`

**Fix:** Use `theme.background` (for contrast on primary button)

### 2. `src/components/calendar/CalendarView.tsx`
**Issue (line 166):**
- Dot: `selectedDotColor: '#ffffff'`

**Fix:** Use `theme.background`

### 3. `src/app/+not-found.tsx`
**Issue (line 38):**
- Link: `color: '#2e78b7'`

**Fix:** Use `theme.primary` or add `link` color to theme

### 4. `src/app/(tabs)/_layout.tsx`
**Issues (lines 8, 16):**
- `activeColor = '#D4382A'`
- Tab bar background has inline conditional

**Fix:** Use `useTheme()` hook consistently

## Todo List
- [ ] Update EventForm.tsx
- [ ] Update CalendarView.tsx
- [ ] Update +not-found.tsx
- [ ] Update _layout.tsx
- [ ] Full dark mode test

## Success Criteria
- All components respect theme
- Dark mode fully functional
- Delete legacy Colors.ts if unused
