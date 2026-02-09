# Scout Report: Calendar & Navigation Components

**Date:** 2026-02-09 | **Task:** Find calendar page/component files, navigation/button components, and existing "today" functionality

---

## Summary

Found comprehensive calendar infrastructure with reactive date state management. The app uses Expo Router with React Native Calendars, but currently lacks an explicit "jump to today" button in the calendar UI. Today's date is tracked internally but not directly exposed as a navigation element.

---

## 1. Calendar Page/Component Files

### Main Calendar Screen (Entry Point)
- **File:** `/Users/thinhpham/dev/calendar-app/src/app/(tabs)/index.tsx`
- **Purpose:** Tab-based calendar screen entry point
- **Details:** Simple wrapper that imports and renders `CalendarView`

### Core Calendar Component
- **File:** `/Users/thinhpham/dev/calendar-app/src/components/calendar/CalendarView.tsx` (124 lines)
- **Key Features:**
  - Uses `react-native-calendars` Calendar component with custom rendering
  - Maintains `selectedDate` state (current selection)
  - Uses `getDayInfo()` service to compute lunar calendar data
  - Month navigation via swipe (`enableSwipeMonths={true}`)
  - Arrow buttons for prev/next month navigation (rendered via `renderArrow` prop)
  - Modal support for day details (opened on day press)
  - Theme integration via `useTheme()` hook
  - **TODAY HANDLING:** Currently initializes to today via `new Date().toISOString().split('T')[0]` but no explicit "jump to today" button exists

### Day Cell Component (Individual Date Cell)
- **File:** `/Users/thinhpham/dev/calendar-app/src/components/calendar/DayCell.tsx` (130 lines)
- **Props:** Accepts `isToday` boolean to highlight today's date
- **Styling:** Today's date gets special border and color treatment (`theme.today` - Vietnamese red #D4382A)

### Day Detail Modal
- **File:** `/Users/thinhpham/dev/calendar-app/src/components/calendar/DayDetailModal.tsx` (199 lines)
- **Purpose:** Full-screen modal showing detailed day info
- **Content:** Solar/lunar dates, Can-Chi info, auspicious hours, holidays
- **Close Button:** Top-left X button (via Ionicons chevron-back)

### Auspicious Hours Grid
- **File:** `/Users/thinhpham/dev/calendar-app/src/components/calendar/AuspiciousHoursGrid.tsx`
- **Purpose:** Displays lucky hours for the selected day

---

## 2. Navigation & Button Components

### Tab Navigation Layout
- **File:** `/Users/thinhpham/dev/calendar-app/src/app/(tabs)/_layout.tsx` (50 lines)
- **Structure:** Expo Router Tabs with 3 screens:
  1. **index** → "Lịch" (Calendar) - calendar icon
  2. **events** → "Sự kiện" (Events) - list icon
  3. **settings** → "Cài đặt" (Settings) - settings icon
- **Active Color:** Vietnamese red (#D4382A)
- **Icons:** Ionicons (expo/vector-icons)

### Common Button Component
- **File:** `/Users/thinhpham/dev/calendar-app/src/components/common/Button.tsx` (99 lines)
- **Features:**
  - Variants: `primary` | `secondary` | `outline`
  - Props: `title`, `onPress`, `loading`, `disabled`, `variant`, `style`, `textStyle`
  - Loading state with ActivityIndicator
  - Accessible and well-styled
  - Primary color: #D4382A (Vietnamese red)

### Header Component (Reusable)
- **File:** `/Users/thinhpham/dev/calendar-app/src/components/common/Header.tsx` (62 lines)
- **Features:**
  - Title display
  - Optional back button
  - Optional right element slot for actions
  - Used in modals and detail screens

### Common Modal Component
- **File:** `/Users/thinhpham/dev/calendar-app/src/components/common/Modal.tsx`
- **Status:** Exists but not explicitly used (day detail modal built directly)

---

## 3. Existing "Today" Functionality

### Current Implementation
- **Calendar Initialization:** CalendarView initializes `selectedDate` to today on mount
  ```typescript
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  ```
- **Visual Indicator:** The `react-native-calendars` library automatically highlights today with border/color via `state === 'today'` detection
- **DayCell Styling:** Today's cell receives special styling when `isToday={true}`

### MISSING: No Explicit "Jump to Today" Button
- The calendar has month navigation arrows (prev/next) but **no "today" button**
- User can swipe or press arrows to navigate but cannot instantly jump to today from other months
- This is a common UX pattern (e.g., Google Calendar's "Today" button)

---

## 4. Relevant Services & Utilities

### Lunar Calendar Service
- **File:** `/Users/thinhpham/dev/calendar-app/src/services/lunar/index.ts`
- **Main Function:** `getDayInfo(day, month, year)` - returns complete day information
- **Returns:** Solar date, lunar date, Can-Chi, zodiac, holiday info

### Lunar Converter
- **File:** `/Users/thinhpham/dev/calendar-app/src/services/lunar/converter.ts`
- **Functions:** `dateToJd()`, `jdToDate()`, `lunarToSolar()`, `solarToLunar()`

### Constants & Theme
- **Theme File:** `/Users/thinhpham/dev/calendar-app/src/constants/theme.ts` (68 lines)
- **Today Color:** Defined as `today: palette.red` (#D4382A in light, #FF5A4D in dark)

### Accessibility Utilities
- **File:** `/Users/thinhpham/dev/calendar-app/src/utils/accessibility.ts`
- **Function:** `getLunarDateAccessibilityLabel()` - for screen readers

### Hooks
- **Files:**
  - `/Users/thinhpham/dev/calendar-app/src/hooks/useLunarDate.ts`
  - `/Users/thinhpham/dev/calendar-app/src/hooks/useAuspiciousHours.ts`

---

## 5. Key Insights

### Architecture
- **State Management:** CalendarView maintains local `selectedDate` state
- **Theme System:** Robust theme hook with light/dark mode support
- **Icons:** Ionicons from Expo (chevron-back, chevron-forward, calendar, list, settings, etc.)
- **Calendar Library:** `react-native-calendars` with custom day component rendering

### For "Jump to Today" Feature
- CalendarView already initializes with today's date
- Need to add a button that resets `selectedDate` to today's date string
- Button placement options:
  1. In CalendarView header (next to month display)
  2. Below calendar (above modal)
  3. In calendar header area (alongside navigation arrows)

### Current Month Navigation
- `enableSwipeMonths={true}` - gesture-based
- `renderArrow()` - renders left/right chevrons for month navigation
- No month/year display text found - likely part of library's default header

---

## Files Summary Table

| Category | File Path | Lines | Purpose |
|----------|-----------|-------|---------|
| **Calendar Page** | `src/app/(tabs)/index.tsx` | 18 | Entry point for calendar tab |
| **Calendar Component** | `src/components/calendar/CalendarView.tsx` | 124 | Main calendar view, date state |
| **Day Cell** | `src/components/calendar/DayCell.tsx` | 130 | Individual date cell renderer |
| **Day Modal** | `src/components/calendar/DayDetailModal.tsx` | 199 | Day detail display modal |
| **Auspicious Hours** | `src/components/calendar/AuspiciousHoursGrid.tsx` | ? | Lucky hours grid |
| **Button Component** | `src/components/common/Button.tsx` | 99 | Reusable button with variants |
| **Header Component** | `src/components/common/Header.tsx` | 62 | Reusable header with back button |
| **Tab Navigation** | `src/app/(tabs)/_layout.tsx` | 50 | Tab bar with 3 screens |
| **Lunar Service** | `src/services/lunar/index.ts` | 31 | Main lunar calendar API |
| **Theme** | `src/constants/theme.ts` | 68 | Color palette and theme hook |

---

## Unresolved Questions

1. **Month/Year Display:** Where is the current month/year text displayed in CalendarView? Is it part of `react-native-calendars` default or custom?
2. **DayDetailModal Placement:** Should the "today" button be in CalendarView or also accessible from the DayDetailModal header?
3. **Button Style:** Should match existing UI (likely primary button style with Vietnamese red color)

---

## Next Steps (Implementation Recommendation)

1. Add a "Hôm nay" (Today) button in CalendarView header/footer
2. Button should call `setSelectedDate(new Date().toISOString().split('T')[0])`
3. Position: Likely below calendar grid or in a toolbar near navigation arrows
4. Style: Use existing Button component with primary variant
