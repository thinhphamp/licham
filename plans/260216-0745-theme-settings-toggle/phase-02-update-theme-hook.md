# Phase 02: Update useTheme Hook

## Context
- Parent: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-add-theme-state-to-store.md)

## Overview
- **Priority**: P1
- **Status**: Pending
- **Description**: Modify `useTheme()` to respect user preference from settingsStore

## Key Insights
- Current `useTheme()` only reads system `useColorScheme()`
- Need to combine system preference with user override
- Logic: if `themeMode === 'system'`, use system; else use user choice

## Requirements
- Import and read `themeMode` from settingsStore
- Apply user preference when not 'system'
- Keep backward compatibility (system mode works as before)

## Related Code Files
- **Modify**: `src/constants/theme.ts`

## Implementation Steps

1. Import settingsStore:
```typescript
import { useSettingsStore } from '@/stores/settingsStore';
```

2. Update `useTheme()` function:
```typescript
export function useTheme() {
    const systemColorScheme = useColorScheme();
    const themeMode = useSettingsStore((s) => s.themeMode);

    // Determine effective color scheme
    const effectiveScheme = themeMode === 'system'
        ? systemColorScheme
        : themeMode;

    const theme = effectiveScheme === 'dark' ? colors.dark : colors.light;

    return {
        ...theme,
        isDark: effectiveScheme === 'dark',
    };
}
```

## Todo List
- [ ] Import useSettingsStore
- [ ] Read themeMode from store
- [ ] Calculate effective scheme based on mode
- [ ] Return correct theme based on effective scheme
- [ ] Test system/light/dark modes

## Success Criteria
- `themeMode: 'system'` follows device setting
- `themeMode: 'light'` always shows light theme
- `themeMode: 'dark'` always shows dark theme
- Theme updates immediately on change

## Risk Assessment
- Medium: Hook used across entire app
- Mitigation: Default 'system' ensures no visual change until user changes

## Next Steps
- Phase 03: Add settings UI for theme selection
