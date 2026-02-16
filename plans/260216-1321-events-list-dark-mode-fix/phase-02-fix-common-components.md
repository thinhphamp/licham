# Phase 02: Fix Common Components

## Context
- Parent: [plan.md](./plan.md)

## Overview
- **Priority**: P1
- **Status**: pending
- **Description**: Fix hardcoded colors in shared UI components

## Files to Modify

### 1. `src/components/common/Modal.tsx`
**Issues (lines 30, 44, 53, 61):**
- Close icon: `color="#666666"`
- Container: `backgroundColor: '#FFFFFF'`
- Header border: `borderBottomColor: '#EEEEEE'`
- Title: `color: '#1A1A1A'`

**Fix:** Use `theme.textMuted`, `theme.background`, `theme.border`, `theme.text`

### 2. `src/components/common/Header.tsx`
**Issues (lines 20, 39, 41, 59):**
- Back icon: `color="#1A1A1A"`
- Container: `backgroundColor: '#FFFFFF'`
- Border: `borderBottomColor: '#EEEEEE'`
- Title: `color: '#1A1A1A'`

**Fix:** Use `theme.text`, `theme.background`, `theme.border`

### 3. `src/components/common/Button.tsx`
**Issues (lines 46, 74, 79, 82, 83, 90, 93, 96):**
- Loading indicator colors
- Primary button bg/border
- Secondary button bg/border
- Text colors for each variant

**Fix:** Use `theme.primary`, `theme.background`, `theme.surface`, `theme.border`, `theme.text`

## Todo List
- [ ] Update Modal.tsx with useTheme
- [ ] Update Header.tsx with useTheme
- [ ] Update Button.tsx with useTheme
- [ ] Test components in dark mode

## Success Criteria
- All common components adapt to theme
- Consistent appearance across app
