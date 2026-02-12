# Scout Report: Calendar-App Codebase Inventory

**Scope:** Target directories for documentation update (src/app/, src/components/, src/stores/)
**Focus:** Recent changes and key architectural files

---

## 1. Core Application Screens (src/app/)

### Pages & Navigation

| File | Purpose | Key Exports | Dependencies |
|------|---------|-------------|--------------|
| **/src/app/_layout.tsx** | Root layout, app initialization | - | expo-router, useSettingsStore |
| **/src/app/(tabs)/_layout.tsx** | Tab navigation (Calendar, Events, Settings) | - | expo-router, Ionicons |
| **/src/app/(tabs)/index.tsx** | Calendar screen entry point | CalendarScreen component | CalendarView component |
| **/src/app/(tabs)/events.tsx** | Events list screen | - | EventList component, useEventsStore |
| **/src/app/(tabs)/settings.tsx** | Settings & preferences (RECENTLY MODIFIED) | SettingsScreen | useSettingsStore, useTheme |
| **/src/app/day/[date].tsx** | Dynamic day detail page | - | getDayInfo service |
| **/src/app/event/[id].tsx** | Event detail/edit page | - | eventStore, EventForm component |
| **/src/app/event/new.tsx** | Create new event screen | - | EventForm, eventStore |
| **/src/app/+not-found.tsx** | 404 fallback page | - | - |
| **/src/app/+html.tsx** | HTML root element (web support) | - | - |

---

## 2. UI Components (src/components/)

### Calendar Components

| File | Purpose | Key Exports | Dependencies |
|------|---------|-------------|--------------|
| **/src/components/calendar/CalendarView.tsx** | Main calendar widget (RECENTLY MODIFIED) | CalendarView | getDayInfo, useEventsStore, MonthYearPickerModal, DayDetailModal, DayCell, theme, react-native-calendars |
| **/src/components/calendar/MonthYearPickerModal.tsx** | Year/month dual-picker modal | MonthYearPickerModal | useTheme, state management for view modes (month/year grid) |
| **/src/components/calendar/DayDetailModal.tsx** | Day info modal with auspicious hours | DayDetailModal | DayInfo type, getAuspiciousHours, dateToJd, AuspiciousHoursGrid, useRouter (event creation) |
| **/src/components/calendar/DayCell.tsx** | Individual day cell renderer | DayCell | Solar & lunar date display, holiday highlighting, event indicators |
| **/src/components/calendar/AuspiciousHoursGrid.tsx** | Auspicious hours 12-hour display | AuspiciousHoursGrid | - |

### Event Components

| File | Purpose | Key Exports | Dependencies |
|------|---------|-------------|--------------|
| **/src/components/events/EventForm.tsx** | Create/edit event form | EventForm | EventFormData, lunarToSolar, useSettingsStore, Picker (recurrence, reminders) |
| **/src/components/events/EventList.tsx** | List of events for given date/month | EventList | useEventsStore, EventCard component |
| **/src/components/events/EventCard.tsx** | Event item display | EventCard | Event type, deletion/editing handlers |

### Common Components

| File | Purpose | Key Exports | Dependencies |
|------|---------|-------------|--------------|
| **/src/components/common/Button.tsx** | Reusable button | Button | useTheme |
| **/src/components/common/Header.tsx** | Header bar | Header | useTheme |
| **/src/components/common/Modal.tsx** | Modal wrapper | Modal | - |
| **/src/components/common/AccessibleText.tsx** | Accessibility wrapper | AccessibleText | - |

### Base Components

| File | Purpose | Key Exports |
|------|---------|-------------|
| **/src/components/Themed.tsx** | Theme-aware wrapper | Themed |
| **/src/components/StyledText.tsx** | Styled text variants | - |
| **/src/components/ExternalLink.tsx** | Link handler | - |
| **/src/components/EditScreenInfo.tsx** | Dev info display | - |

---

## 3. State Management (src/stores/)

### Zustand Stores with MMKV Persistence

| File | Purpose | Key Exports | Key Methods |
|------|---------|-------------|-------------|
| **/src/stores/eventStore.ts** | Event CRUD + notification sync | useEventsStore | addEvent, updateEvent, deleteEvent, getEventsForLunarDate, getEventsForMonth, importEvents |
| **/src/stores/settingsStore.ts** | User preferences & reminders (RECENTLY MODIFIED) | useSettingsStore | setShowLunarDates, setShowAuspiciousHours, setReminderDaysBefore, setReminderTime |
| **/src/stores/storage.ts** | MMKV adapter layer | mmkvStorage, initializeStorage | getItem, setItem, removeItem |

---

## 4. Recent Modifications Overview

### CalendarView.tsx Changes
**Key Updates:**
- Integrated `MonthYearPickerModal` for year/month selection (lines 172-182)
- Year selector triggered via header touchable (line 138, opens `isPickerVisible`)
- Grid-based month/year picker modal with state management
- Day cell rendering with event occurrence detection using `isEventOccurring` utility
- Enhanced header with "Hôm nay" (Today) button styling

**Dependencies Added/Modified:**
- New: MonthYearPickerModal component
- Uses: react-native-calendars Calendar component with custom renderDay
- Lunar date calculations via getDayInfo service
- Event store queries for visual indicators

### SettingsScreen.tsx Changes
**Key Updates:**
- Time picker modal (30-min intervals, 0:00-23:30)
- Reminder configuration UI (days before, specific time)
- Data export/import functionality
- Section-based layout (Reminders, Data, App Info)
- Vietnamese UI labels

**Dependencies:**
- useSettingsStore for persistent settings
- exportData, importData services for data management
- Theme integration for dark mode support

### settingsStore.ts Structure
**State Properties:**
- `showLunarDates`: boolean (default: true)
- `showAuspiciousHours`: boolean (default: true)
- `reminderDaysBefore`: number (default: 1 day)
- `reminderTime`: string "HH:mm" format (default: "08:00")

**Persistence:** MMKV storage adapter with Zustand middleware

---

## 5. Architecture Patterns Observed

### State Flow
```
useEventsStore → MMKV (persistent)
  ├─ addEvent → scheduleEventNotification
  ├─ updateEvent → cancelNotification + reschedule
  └─ deleteEvent → cancelNotification

useSettingsStore → MMKV (persistent)
  ├─ reminderDaysBefore
  ├─ reminderTime
  └─ UI preferences (lunar dates, auspicious hours)
```

### Navigation Patterns
- Expo Router file-based routing with (tabs) group layout
- Dynamic routes: `/day/[date]`, `/event/[id]`, `/event/new`
- Modal navigation via router.push() with params (DayDetailModal → EventForm)

### Component Composition
- CalendarView → DayCell (day rendering)
- CalendarView → MonthYearPickerModal (date selection)
- CalendarView → DayDetailModal (day details)
- DayDetailModal → AuspiciousHoursGrid (auspicious hours)

---

## 6. File Count Summary

| Directory | Count | Details |
|-----------|-------|---------|
| src/app/ | 10 | 1 layout, 3 screen entries, 2 event routes, 2 day routes, 2 error pages |
| src/components/ | 16 | 5 calendar, 3 events, 4 common, 4 base |
| src/stores/ | 3 | 2 Zustand stores (events, settings) + MMKV adapter |
| **TOTAL** | **29** | - |

---

## 7. Key Integration Points for Documentation

### Critical Dependencies
1. **Service Layer**: getDayInfo, lunarToSolar, getAuspiciousHours (lunar conversion)
2. **Notifications**: scheduleEventNotification, cancelNotification
3. **Data Services**: exportData, importData
4. **Theme System**: useTheme hook (all components)
5. **Routing**: expo-router for page navigation + params passing

### Data Flow Example (Event Creation)
```
DayDetailModal (with handleCreateEvent)
  → router.push('/event/new', { lunarDay, lunarMonth, lunarYear })
  → EventForm (initialData from params)
  → onSubmit(EventFormData)
  → useEventsStore.addEvent()
  → scheduleEventNotification()
  → MMKV persistence
```

---

## 8. TypeScript Integration

**Key Types Referenced:**
- `LunarEvent`: Full event object with lunar dates, reminders, recurrence
- `EventFormData`: Form input structure with DateSystem ("lunar" | "solar")
- `DayInfo`: Day information from lunar service
- `RecurrenceConfig`: Recurrence rule structure
- `EventType`: "personal" | "holiday" | "anniversary"

**Type Sources:** `/src/types/event.ts` (not scouted, external reference)

---

## 9. Unresolved Questions

1. Where is `/src/types/event.ts` and other type definitions?
2. How are recurrence calculations handled in `isEventOccurring` utility?
3. What is the complete structure of services/lunar/ and services/notifications/?
4. Are there any helper hooks in `/src/hooks/`?
5. What constants are defined in `/src/constants/`?
6. How is data export/import handled in dataService?

---

**Report Generated:** 2026-02-12
**Scope Completeness:** ~85% (main files surveyed, service layers partially reviewed via imports)
