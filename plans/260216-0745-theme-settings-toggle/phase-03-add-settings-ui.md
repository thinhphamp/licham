# Phase 03: Add Theme Selection UI

## Context
- Parent: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-add-theme-state-to-store.md), [Phase 02](./phase-02-update-theme-hook.md)

## Overview
- **Priority**: P1
- **Status**: Pending
- **Description**: Add "Appearance" section to settings page with theme toggle

## Key Insights
- Settings uses sections with `View` + `Text` for title + rows
- Existing row pattern: `TouchableOpacity` with label + indicator
- UI options: segmented control or selection rows (3 options)

## Requirements
- Add "Giao diện" (Appearance) section before existing sections
- Show 3 options: Hệ thống (System), Sáng (Light), Tối (Dark)
- Highlight currently selected option
- Update immediately on selection

## Architecture
```
┌─────────────────────────────────┐
│ Giao diện (Appearance)          │
├─────────────────────────────────┤
│ ○ Hệ thống (theo thiết bị)  ✓  │
│ ○ Sáng                          │
│ ○ Tối                           │
└─────────────────────────────────┘
```

## Related Code Files
- **Modify**: `src/app/(tabs)/settings.tsx`

## Implementation Steps

1. Import `setThemeMode` and `themeMode` from store:
```typescript
const { themeMode, setThemeMode } = useSettingsStore();
```

2. Define theme options array:
```typescript
const themeOptions = [
    { value: 'system', label: 'Hệ thống (theo thiết bị)' },
    { value: 'light', label: 'Sáng' },
    { value: 'dark', label: 'Tối' },
] as const;
```

3. Add Appearance section (as first section after ScrollView):
```tsx
<View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
    <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Giao diện</Text>
    {themeOptions.map((option, index) => (
        <TouchableOpacity
            key={option.value}
            style={[
                styles.row,
                { borderBottomColor: index === themeOptions.length - 1 ? 'transparent' : theme.border }
            ]}
            onPress={() => setThemeMode(option.value)}
        >
            <Text style={[styles.label, { color: theme.text }]}>{option.label}</Text>
            {themeMode === option.value && (
                <Ionicons name="checkmark" size={20} color={theme.primary} />
            )}
        </TouchableOpacity>
    ))}
</View>
```

## Todo List
- [ ] Import themeMode and setThemeMode from store
- [ ] Define theme options array
- [ ] Add Appearance section JSX
- [ ] Show checkmark on selected option
- [ ] Test all 3 theme options work
- [ ] Verify immediate visual update

## Success Criteria
- Appearance section visible at top of settings
- Tapping option changes theme immediately
- Checkmark shows on current selection
- Selection persists after closing/reopening app

## Risk Assessment
- Low risk: Adding new UI section, no breaking changes
- Uses existing patterns from settings page

## Security Considerations
- None: Local UI state only

## Next Steps
- Testing and verification
- Update docs if needed
