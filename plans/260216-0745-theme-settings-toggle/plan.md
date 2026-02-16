---
title: "Dark/Light Theme Toggle in Settings"
description: "Add theme selection (System/Light/Dark) to settings page with persistence"
status: completed
completed: 2026-02-16T07:55:00+07:00
priority: P2
effort: 1h
branch: main
tags: [settings, theme, ui, zustand]
created: 2026-02-16
---

# Dark/Light Theme Toggle Implementation

## Overview

Add user-controllable theme selection to the settings page, allowing users to override system theme preference with Light, Dark, or System (follow device) options.

## Current State

- `src/constants/theme.ts`: Has light/dark color palettes, `useTheme()` reads system `useColorScheme()`
- `src/stores/settingsStore.ts`: Zustand + MMKV persistence, no theme state yet
- `src/app/(tabs)/settings.tsx`: Settings UI with sections for reminders, data, debug
- `src/app/_layout.tsx`: `ThemeProvider` uses system `colorScheme`

## Implementation Phases

| Phase | Description | Status | Effort |
|-------|-------------|--------|
| [Phase 01](./phase-01-add-theme-state-to-store.md) | Add themeMode to settingsStore | Completed | 1h |
| [Phase 02](./phase-02-update-theme-hook.md) | Update useTheme() to respect store | Completed | 1h |
| [Phase 03](./phase-03-add-settings-ui.md) | Add Appearance section to settings UI | Completed | 1h |

## Key Files

- `src/stores/settingsStore.ts` - Add themeMode state
- `src/constants/theme.ts` - Update useTheme() hook
- `src/app/(tabs)/settings.tsx` - Add appearance section

## Success Criteria

- [x] User can select Light, Dark, or System theme
- [x] Theme persists after app restart
- [x] Theme applies immediately without restart
- [x] All screens respect selected theme
