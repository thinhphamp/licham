# Phase 01: Add Theme State to Settings Store

## Context
- Parent: [plan.md](./plan.md)
- Docs: [code-standards.md](../../docs/code-standards.md)

## Overview
- **Priority**: P1
- **Status**: Pending
- **Description**: Add `themeMode` state and setter to settingsStore with MMKV persistence

## Key Insights
- settingsStore uses Zustand + MMKV via `createJSONStorage`
- Existing pattern: state + setter pairs (e.g., `showLunarDates` + `setShowLunarDates`)
- Type: `'system' | 'light' | 'dark'` with `'system'` as default

## Requirements
- Add `themeMode` state with type union
- Add `setThemeMode` action
- Default to `'system'` for backward compatibility
- Persist via existing MMKV storage

## Related Code Files
- **Modify**: `src/stores/settingsStore.ts`

## Implementation Steps

1. Add type for theme mode at top of file:
```typescript
type ThemeMode = 'system' | 'light' | 'dark';
```

2. Add to `SettingsState` interface:
```typescript
themeMode: ThemeMode;
setThemeMode: (mode: ThemeMode) => void;
```

3. Add to store initial state:
```typescript
themeMode: 'system',
```

4. Add setter action:
```typescript
setThemeMode: (mode) => set({ themeMode: mode }),
```

## Todo List
- [ ] Add `ThemeMode` type
- [ ] Add `themeMode` to interface
- [ ] Add `setThemeMode` to interface
- [ ] Add default value `'system'`
- [ ] Add setter implementation
- [ ] Verify MMKV persistence works

## Success Criteria
- `useSettingsStore().themeMode` returns current mode
- `useSettingsStore().setThemeMode('dark')` updates state
- State persists after app restart

## Risk Assessment
- Low risk: Simple state addition following existing patterns
- No breaking changes to existing functionality

## Next Steps
- Phase 02: Update `useTheme()` hook to read from store
