# Phase 01: Fix Screen Backgrounds

## Context
- Parent: [plan.md](./plan.md)
- Theme: `src/constants/theme.ts`

## Overview
- **Priority**: P1
- **Status**: ✅ done
- **Description**: Fix hardcoded backgrounds in screen components

## Files to Modify

### 1. `src/app/(tabs)/events.tsx`
**Issues:**
- Line 17: `color="#FFFFFF"` on icon
- Line 26: `backgroundColor: '#F8F8F8'`
- Line 35: `backgroundColor: '#D4382A'`

**Fix:**
```tsx
import { useTheme } from '@/constants/theme';

export default function EventsScreen() {
  const theme = useTheme();
  // ...
  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceAlt }]}>
      {/* ... */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]}>
        <Ionicons name="add" size={30} color={theme.background} />
      </TouchableOpacity>
    </View>
  );
}
```

### 2. `src/app/(tabs)/index.tsx`
**Issues:**
- Line 15: `backgroundColor: '#FFFFFF'`

**Fix:** Use `theme.background`

### 3. `src/app/event/[id].tsx`
**Issues:**
- Line 52: `color="#D4382A"` on delete icon
- Line 61: `backgroundColor: '#FFFFFF'`
- Line 70: `backgroundColor: '#FFF3F0'`

**Fix:** Use `theme.primary`, `theme.background`, `theme.selected`

## Todo List
- [ ] Update events.tsx with useTheme
- [ ] Update index.tsx with useTheme
- [ ] Update event/[id].tsx with useTheme
- [ ] Test all screens in dark mode

## Success Criteria
- All 3 screens adapt to dark/light mode
- No visual regression in light mode
