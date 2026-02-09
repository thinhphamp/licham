# Phase 01: Add Solar Date Display Below Lunar Pickers in EventForm

## Context Links

- Parent plan: [plan.md](./plan.md)
- Code standards: [docs/code-standards.md](../../docs/code-standards.md)
- Lunar service: [src/services/lunar/index.ts](../../src/services/lunar/index.ts)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-09 |
| Priority | P2 |
| Effort | 1h |
| Implementation Status | Completed |
| Review Status | Pending |

**Description**: Add a computed solar date display below the lunar date pickers in EventForm. Uses `useMemo` to derive solar date from lunar selection.

## Key Insights

1. `lunarToSolar()` requires `lunarYear` - use current year for recurring events
2. Returns `{ day: 0, month: 0, year: 0 }` for invalid leap month combinations
3. Form already has `lunarDay`, `lunarMonth`, `isLeapMonth` state
4. Component uses `useTheme()` for styling consistency

## Requirements

### Functional
- Display solar date formatted as "DD/MM/YYYY" (Vietnamese format)
- Update dynamically when lunar date pickers change
- Handle invalid dates (show nothing or error state)

### Non-Functional
- Use `useMemo` for computation (avoid re-renders)
- Follow existing styling patterns
- Maintain accessibility

## Architecture

```
+--------------------------------------+
|         Lunar Date Pickers           |
|  [Day Picker] [Month Picker]         |
|  [Leap Month Toggle]                 |
+--------------------------------------+
|  Ngay duong lich: DD/MM/YYYY         |  <-- NEW
+--------------------------------------+
```

## Related Code Files

### Modify
- `src/components/events/EventForm.tsx` - Add import, useMemo, and UI element

### Reference (no changes)
- `src/services/lunar/converter.ts` - `lunarToSolar()` function
- `src/services/lunar/types.ts` - `SolarDate` type

## Implementation Steps

### Step 1: Import lunarToSolar
Add import at top of EventForm.tsx:
```typescript
import { lunarToSolar } from '@/services/lunar';
```

### Step 2: Add useMemo for Solar Date
After existing state declarations, add:
```typescript
const solarDate = useMemo(() => {
    const year = initialData?.lunarYear ?? new Date().getFullYear();
    const result = lunarToSolar(lunarDay, lunarMonth, year, isLeapMonth);
    if (result.day === 0) return null;
    return result;
}, [lunarDay, lunarMonth, isLeapMonth, initialData?.lunarYear]);
```

### Step 3: Add Solar Date Display UI
After the leap month switch row (line ~184), add:
```tsx
{solarDate && (
    <View style={styles.solarDateRow}>
        <Text style={[styles.solarDateLabel, { color: theme.textMuted }]}>
            Ngay duong lich:
        </Text>
        <Text style={[styles.solarDateValue, { color: theme.text }]}>
            {solarDate.day.toString().padStart(2, '0')}/{solarDate.month.toString().padStart(2, '0')}/{solarDate.year}
        </Text>
    </View>
)}
```

### Step 4: Add Styles
Add to StyleSheet.create:
```typescript
solarDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
},
solarDateLabel: {
    fontSize: 14,
},
solarDateValue: {
    fontSize: 14,
    fontWeight: '500',
},
```

## Todo List

- [x] Import `lunarToSolar` from lunar service
- [x] Import `useMemo` from React
- [x] Add `solarDate` useMemo computation
- [x] Add solar date display JSX after leap month toggle
- [x] Add styles for `solarDateRow`, `solarDateLabel`, `solarDateValue`
- [x] Test with various lunar dates
- [x] Test leap month edge cases
- [x] Run `npm run lint` to verify no errors

## Success Criteria

- [ ] Solar date displays below lunar date section
- [ ] Updates immediately when lunar day/month/leap changes
- [ ] Uses current year for conversion when no lunarYear provided
- [ ] Gracefully handles invalid dates (no crash, hides display)
- [ ] Follows existing code style and theming
- [ ] TypeScript compiles without errors
- [ ] ESLint passes

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Invalid date crash | Low | High | Check for result.day === 0 before display |
| Wrong year used | Medium | Medium | Document behavior, use current year fallback |
| Performance on frequent re-renders | Low | Low | useMemo caches computation |

## Security Considerations

- No user input validation needed (pickers provide valid ranges)
- No external API calls
- No sensitive data handling

## Next Steps

1. Implement changes
2. Manual testing on iOS and Android
3. Run lint and type checks
4. Create PR
