# Codebase Summary - Lịch Việt

Complete overview of the Vietnamese Lunar Calendar app codebase structure, module organization, and data flow patterns.

## Project Architecture

```
┌──────────────────────────────────────────────────┐
│     UI Layer (Expo Router + React Components)    │
│  Calendar │ Events │ Settings │ Day Detail       │
└──────────────────────────────┬───────────────────┘
                               ↓
┌──────────────────────────────────────────────────┐
│     State Layer (Zustand + MMKV Persistence)     │
│  Events Store │ Settings Store │ Storage Adapter │
└──────────────────────────────┬───────────────────┘
                               ↓
┌──────────────────────────────────────────────────┐
│  Service Layer (Business Logic & Algorithms)     │
│  Lunar │ Notifications │ Data Import/Export      │
└──────────────────────────────┬───────────────────┘
                               ↓
┌──────────────────────────────────────────────────┐
│    Storage Layer (MMKV Key-Value Store)          │
│  Events │ Settings │ Cache │ Metadata            │
└──────────────────────────────────────────────────┘
```

## Codebase Statistics

**Total Files**: 32 files in src/
- **src/app/** (10 files): Expo Router pages and navigation
- **src/components/** (16 files): Reusable UI components
- **src/stores/** (3 files): State management with Zustand + MMKV
- **src/services/** (multiple files): Business logic and algorithms
- **src/hooks/** (custom hooks): Lunar calculations and utilities
- **src/constants/**, **src/types/**, **src/utils/**: Support files
- **Testing**: Vitest configuration and unit tests in `__tests__` directories

**Current Version**: 1.1.1 (Phase 1 & 2 Improvements)

## Directory Structure & Module Organization

### App Routes (`src/app/`)

**Root Layout** (`_layout.tsx`)
- Initializes app-wide providers and MMKV storage
- Configures React Navigation theme (Dark/Light)
- Loads system fonts (SpaceMono for monospace)
- Sets up ErrorBoundary for error handling
- Prevents splash screen auto-hide until assets load

**Tab Navigation** (`(tabs)/_layout.tsx`)
- File-based routing group for bottom tab bar
- Three primary tabs: Calendar, Events, Settings
- Persistent navigation state across tabs
- Platform-specific tab styling (iOS: lighter, Android: material design)

**Calendar Tab** (`(tabs)/index.tsx`)
- Main calendar view with responsive month/year navigation
- CalendarView with year/month selector grid modal
- Displays lunar date overlay on solar calendar
- Quick event indicator (dot/badge on event days)
- Optimized rendering with `CalendarDay` memo component and `eventsMap` pre-calculation
- Tap to navigate to DayDetailModal
- Responsive header design with year/month selectors

**Events Tab** (`(tabs)/events.tsx`)
- Events list view filtered by lunar month (current month default)
- EventList component with sorting/filtering options
- FAB (Floating Action Button) to create new events
- Event search and categorization

**Settings Tab** (`(tabs)/settings.tsx`)
- Dark/light theme toggle
- Lunar display mode (traditional/simplified)
- Editable reminder settings with UI controls:
  - Days before reminder (0-30 days configurable)
  - Time picker modal for reminder time selection
  - Global notification preferences (enabled/disabled)
- Data export/import controls
- App info and version display

**Event Management Routes**
- `event/new.tsx` - Create new lunar date event (modal presentation)
- `event/[id].tsx` - Edit existing event (modal presentation)
- `day/[date].tsx` - Day detail view with all events (card presentation)

### Components (`src/components/`)

**Calendar Components** (`calendar/`)
- **CalendarView.tsx**: Main calendar grid using react-native-calendars
  - Solar calendar grid with lunar dates overlaid
  - Month/year navigation with arrow buttons
  - Marked dates highlighting (events, holidays, today)
  - Touch handlers for date selection
  - Theme-aware styling with cultural colors

- **DayCell.tsx**: Individual calendar day cell (memo optimized)
  - Displays solar day number (1-31)
  - Lunar day overlay (LT for Lunar)
  - Event indicator (small dot)
  - Holiday indicator (special color/icon)
  - Touch area: 48x48 dp minimum for accessibility

- **DayDetailModal.tsx**: Full-screen day information modal
  - Comprehensive day information display
  - Can-Chi stem and branch for the day
  - Associated zodiac animal
  - Auspicious hours grid for that day
  - Events list for that lunar date
  - Event creation button
  - Close/back navigation

- **AuspiciousHoursGrid.tsx**: 12 lucky hours display
  - 12 two-hour periods in 24-hour format
  - Color coding (green: very auspicious, yellow: neutral, red: inauspicious)
  - Current time indicator
  - Expandable details per hour (planned)
  - Timezone-aware (Vietnam GMT+7)

**Event Components** (`events/`)
- **EventList.tsx**: Scrollable list of events
  - Filtered by month/date based on context
  - Sorting: by date, by title, by category
  - Pull-to-refresh for data sync
  - Empty state messaging
  - Performance optimized with FlatList

- **EventCard.tsx**: Individual event summary card
  - Title, description excerpt, date
  - Category badge (birthday, ceremony, holiday, etc.)
  - Reminder indicator icon
  - Long-press menu (edit, delete, share)
  - Tap to view/edit event detail

- **EventForm.tsx**: Form for creating/editing events
  - Title input (required, max 100 chars)
  - Description textarea (optional, max 1000 chars)
  - Location input (optional)
  - Lunar date picker (month/day dropdowns)
  - Category dropdown (Birthday, Ceremony, Holiday, etc.)
  - Reminder configuration (enabled toggle + days before + time picker)
  - Save/cancel buttons
- Robust input validation using **Zod schema** (`EventFormDataSchema`)
- Real-time error feedback via Alert or UI indicators

**Common Components** (`common/`)
- **Button.tsx**: Unified button component
  - Variants: primary (red #D4382A), secondary (gold #C4982E), outline, danger
  - Sizes: small (32px), medium (44px), large (56px)
  - States: normal, pressed, disabled, loading
  - Accessibility: minTouchSize 44x44 dp

- **Header.tsx**: App bar component
  - Title/subtitle display
  - Left action button (back, menu, close)
  - Right action button (save, more, settings)
  - Status bar integration
  - Platform-specific styling

- **Modal.tsx**: Reusable modal dialog
  - Centered or full-screen presentation
  - Custom content and button layout
  - Animated transitions
  - Scrim (dim background) interaction
  - Safe area insets handling

- **AccessibleText.tsx**: Accessible text wrapper
  - Semantic heading levels (h1-h6)
  - Screen reader labels
  - Color contrast validation
  - Vietnamese language labels
  - Font scaling support

**Deprecated/Legacy** (kept for reference)
- EditScreenInfo.tsx, ExternalLink.tsx, StyledText.tsx, Themed.tsx
- useClientOnlyValue.ts, useColorScheme.ts (replaced with modern hooks)

### Services (`src/services/`)

**Lunar Calendar Algorithms** (`lunar/`)

- **converter.ts**: Core lunar/solar conversion engine
  - `dateToJd(day, month, year)`: Solar → Julian Day Number
    - Handles Gregorian/Julian calendar transition (Oct 15, 1582)
    - Algorithm: Meeus/Jones/Chernhoff method
  - `jdToDate(jd)`: Julian Day Number → Solar date
    - Reverse conversion with high precision
    - Handles fractional days
  - `lunarToSolar(lunarDay, lunarMonth, lunarYear)`: Lunar → Solar
    - Finds new moon boundaries using astronomical calculations
    - Validates lunar date (1-29/30, 1-12/13)
  - `solarToLunar(solarDay, solarMonth, solarYear)`: Solar → Lunar
    - Reverse conversion with leap month detection
    - Returns DayInfo with Can-Chi data
  - `getDayInfo(date)`: Complete day information
    - Returns: solar, lunar, can-chi, zodiac, auspicious hours

- **canChi.ts**: Can-Chi 60-year cycle calculations
  - 10 Heavenly Stems (Thiên Gan): Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý
  - 12 Earthly Branches (Địa Chi): Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi
  - 12 Zodiac animals: Chuột, Trâu, Hổ, Mèo, Rồng, Rắn, Ngựa, Dê, Khỉ, Gà, Chó, Lợn
  - `getYearCanChi(year)`: Returns {stem, branch, animal} for any year
  - `getDayCanChi(jd)`: Returns {stem, branch} for any Julian Day
  - `getChiForHour(chi, hour)`: Maps hour (0-23) to Chi hour (0-11)
  - Chi cycle: 12 two-hour periods starting at Chuột (Rat) from 23:00

- **auspiciousHours.ts**: Lucky hours calculation
  - `getAuspiciousHours(lunarDate)`: Returns array of 12 AuspiciousHour objects
  - Each hour: {chi, startTime, endTime, luck: 'very-good'|'neutral'|'bad'}
  - Color mapping: green (very-good), yellow (neutral), red (bad)
  - Used for ceremony/event timing recommendations
  - Calculations based on lunar day's stem-branch combination

- **newMoon.ts**: Astronomical new moon calculations
  - `getNewMoonDay(k)`: Returns JD of k-th new moon after year 2000
    - Uses polynomial approximation for mean lunar month
    - Applies solar term and lunar perturbation corrections
    - Accurate to within 0.5 days
  - `getSunLongitude(jd)`: Returns sun's ecliptic longitude
    - Used for leap month detection
    - Degree value: 0-360
  - `getLeapMonthOffset(a11, k11)`: Detects if month is leap
    - Leap months occur when sun doesn't pass major solar term
    - Returns leap month number (0 = not leap)

- **types.ts**: TypeScript interfaces for lunar module
  ```typescript
  interface SolarDate { day: number; month: number; year: number; }
  interface LunarDate { day: number; month: number; year: number; isLeap: boolean; }
  interface DayInfo {
    solar: SolarDate;
    lunar: LunarDate;
    stem: string;  // Heavenly Stem
    branch: string; // Earthly Branch
    animal: string; // Zodiac animal
  }
  ```

- **index.ts**: Public API exports
  - Exports: solarToLunar, lunarToSolar, getDayInfo, getAuspiciousHours, getYearCanChi

**Notification Service** (`notifications/index.ts`)
- Wrapper around expo-notifications
- `scheduleEventNotification(event)`: Schedules notification for event
  - Converts lunar date to solar date
  - Applies reminder offset (days before + time)
  - Generates notification ID
  - Returns notification ID for tracking
- `cancelNotification(notificationId)`: Cancels scheduled notification
  - Removes notification from schedule
  - Called on event deletion
- `requestNotificationPermission()`: Asks user for permission
  - Platform-specific: iOS (UNUserNotificationCenter), Android (Notification)
  - Called on first app launch
- Configuration:
  - Default reminder: 1 day before, 8:00 AM
  - Timezone: Vietnam GMT+7
  - Sound: notification.wav from assets
  - Badge: increments notification count

**Data Service** (`dataService.ts`)
- `exportEventsToJSON(events)`: Converts events to JSON string
  - Includes metadata: exportDate, appVersion
  - Pretty-printed for readability
  - Safe for cloud storage
- `importEventsFromJSON(jsonString)`: Parses JSON events
  - Validates structure and types
  - Error handling for malformed JSON
  - Returns: {events, errors} tuple
- `shareEventsFile(events)`: Exports and opens share dialog
  - Uses expo-sharing to present OS share sheet
  - Filename: calendar-backup-{date}.json
- `pickAndImportEvents()`: Opens file picker
  - Uses expo-document-picker
  - Accepts .json files only
  - Returns parsed events or error

### State Management (`src/stores/`)

**Events Store** (`eventStore.ts`)
- Zustand store with MMKV persistence
- State shape:
  ```typescript
  {
    events: LunarEvent[]
  }
  ```
- Actions:
  - `addEvent(data: EventFormData)`: Creates new event
    - Generates unique ID: event_{timestamp}_{random}
    - Auto-schedules notification if enabled
    - Returns created LunarEvent
  - `updateEvent(id, data)`: Updates existing event
    - Cancels old notification
    - Schedules new notification if enabled
    - Updates updatedAt timestamp
  - `deleteEvent(id)`: Removes event
    - Cancels notification
    - Removes from events array
  - `getEventsForLunarDate(day, month)`: Filter by lunar date
    - Returns events array matching lunar date
    - Used in day detail view
  - `getEventsForMonth(month)`: Filter by lunar month
    - Returns all events in lunar month
    - Used in events list tab
  - `importEvents(events)`: Bulk import from JSON
    - Replaces existing events
    - Re-schedules all notifications
    - Used after file restore

**Settings Store** (`settingsStore.ts`)
- Zustand store with MMKV persistence
- State shape:
  ```typescript
  {
    darkMode: boolean;           // Light/dark theme
    lunarDisplayMode: 'full'|'short'; // Full name or LT abbreviation
    notificationsEnabled: boolean;
    reminderDaysBefore: number;  // 0-30 days (default: 1)
    reminderTime: {hour: number; minute: number}; // Default: 08:00
  }
  ```
- Actions:
  - `setDarkMode(enabled)`: Toggle theme
  - `setLunarDisplayMode(mode)`: Change display format
  - `setNotificationsEnabled(enabled)`: Enable/disable all notifications
  - `setReminderDaysBefore(days)`: Default reminder offset (0-30 days)
  - `setReminderTime(hour, minute)`: Default reminder time
- Applies to all new events and as defaults for event reminders

**Storage Adapter** (`storage.ts`)
- Bridge between Zustand and MMKV
- Implements Zustand StateStorage interface
- `mmkvStorage`: Custom storage object
  - `getItem(name)`: Retrieves from MMKV
  - `setItem(name, value)`: Saves to MMKV
  - `removeItem(name)`: Deletes from MMKV
- `initializeStorage()`: Called on app launch
  - Verifies MMKV initialization
  - Runs migrations if version outdated
  - Seeds default holidays if first launch
- Storage keys:
  - `lich-viet-events`: Serialized events array
  - `lich-viet-settings`: Serialized settings
  - `lich-viet-version`: Storage schema version
  - `lich-viet-holidays`: Pre-loaded holiday data

### Custom Hooks (`src/hooks/`)

**useLunarDate.ts**
- `const {solar, lunar, canChi, auspiciousHours} = useLunarDate(date)`
- Parameters:
  - `date`: Date object to convert (defaults to today)
- Returns:
  - `solar`: SolarDate object (year, month, day)
  - `lunar`: LunarDate object with leap month flag
  - `canChi`: {stem, branch, animal} for the date
  - `auspiciousHours`: Array of 12 AuspiciousHour objects
- Memoization: Results cached, recalculates only if date changes
- Usage: Calendar views, day detail modal, event creation forms

**useAuspiciousHours.ts**
- `const hours = useAuspiciousHours(lunarDay)`
- Parameters:
  - `lunarDay`: Number (1-30, lunar month day)
- Returns: Array of 12 AuspiciousHour objects
  - Each: {chi, startTime, endTime, luck}
- Caching: Results memoized per lunar day
- Usage: AuspiciousHoursGrid component

### Constants (`src/constants/`)

**theme.ts**: Design system
- Colors:
  - Primary: #D4382A (Vietnamese flag red)
  - Secondary: #C4982E (prosperity gold)
  - Success: #10B981, Warning: #F59E0B, Error: #EF4444
  - Text: #1F2937 (light), #F3F4F6 (dark)
  - Background: #FFFFFF (light), #111827 (dark)
  - Border: #E5E7EB (light), #374151 (dark)
- Spacing: 4px base unit (4, 8, 12, 16, 20, 24, 32, 40, 48...)
- Typography:
  - Font families: default (system), monospace (SpaceMono)
  - Sizes: xs (12), sm (14), base (16), lg (18), xl (20), 2xl (24)
  - Weights: regular (400), medium (500), bold (700)
- Border radius: 4, 6, 8, 12, 16, 24 px
- Shadows: sm, md, lg for elevation

**holidays.ts**: Vietnamese holidays database
- Exported as array of Holiday objects
- 13 major holidays with lunar and solar dates
- Fields: name (Vietnamese), date, type, description
- Used by: settingsStore (seeds initial data), CalendarView (marking)
- Holidays include:
  - Tết Nguyên Đán (Lunar New Year)
  - Tết Tây (Jan 1 - Western New Year)
  - Giỗ Tổ Hùng Vương (3/10 lunar)
  - Tết Đoan Ngọ (5/5 lunar - Dragon Boat Festival)
  - Tết Trung Thu (8/15 lunar - Mid-Autumn)
  - And 8 more national holidays

### Types (`src/types/`)

**event.ts**: Event data structures
```typescript
interface EventFormData {
  title: string;
  description?: string;
  location?: string;
  lunarDay: number;
  lunarMonth: number;
  lunarYear?: number;
  category: 'birthday'|'ceremony'|'holiday'|'observance'|'other';
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  reminderTime: {hour: number; minute: number};
}

interface LunarEvent extends EventFormData {
  id: string;
  createdAt: string;  // ISO 8601
  updatedAt: string;
  notificationId?: string;
}
```

### Utilities (`src/utils/`)

**calendar.ts**: Calendar rendering helpers
- `getEventsMapForMonth(events, year, month)`: Pre-calculates event occurrences for a month
  - Returns: `Record<string, boolean>` (ISO Date -> Has Event)
  - Complexity: O(DaysInMonth), reducing render-time check from O(N*30) to O(1)

**accessibility.ts**: A11y helper functions
- `createScreenReaderLabel(text, lang)`: Generates accessible label
  - Vietnamese: "Ngày mồng 1 tháng 1 âm lịch"
  - English: "Lunar 1st of month 1"
- `setAccessibilityRole(element, role)`: Sets semantic role
  - Roles: button, heading, image, text, header, footer
- `announceForAccessibility(message)`: Screen reader announcement
  - Uses AccessibilityInfo (React Native)

## Data Flow Patterns

### 1. Calendar View Interaction
```
User taps date on CalendarView
↓
CalendarView.onDayPress() handler fires
↓
Navigate to day/[date] with date param
↓
DayDetailModal reads route params
↓
useLunarDate(date) hook converts date
↓
getDayInfo returns lunar, canChi, auspiciousHours
↓
AuspiciousHoursGrid renders from data
↓
EventList filters useEventsStore for matching lunar date
↓
Render complete day view
```

### 2. Event Creation Flow
```
User taps "New Event" button
↓
Navigate to event/new screen (modal)
↓
EventForm component renders
↓
User fills title, lunar date, reminder settings
↓
User taps "Save"
↓
EventForm calls useEventsStore.addEvent(data)
↓
addEvent generates ID, schedules notification
↓
Notification scheduled via scheduleEventNotification()
↓
Event stored in MMKV via Zustand persist
↓
Modal closes, calendar refreshes
↓
User sees event dot on calendar date
```

### 3. Notification Flow
```
Event created with reminderEnabled: true
↓
scheduleEventNotification(event) called
↓
Convert lunar date to solar: solarToLunar(event.lunarDay, event.lunarMonth, event.lunarYear)
↓
Calculate notification trigger date: solar - reminderDaysBefore
↓
expo-notifications.scheduleNotificationAsync(trigger)
↓
OS schedules local notification
↓
notificationId stored with event in store
↓
[Reminder time arrives]
↓
Notification fires with event title + description
↓
User can tap to open app to event details
```

### 4. Theme Application
```
useTheme() hook called in component
↓
Reads colorScheme from useColorScheme()
↓
Returns theme object (light or dark palette)
↓
styles created with theme colors: StyleSheet.create({...})
↓
Dynamic styles applied: [styles.base, {backgroundColor: theme.colors.background}]
↓
Component renders with cultural colors
```

## Performance Optimizations

1. **React.memo() on DayCell**: Prevents re-renders of individual cells
2. **useLunarDate memoization**: Caches lunar conversions per date
3. **FlatList in EventList**: Virtualization for large event lists
4. **MMKV storage**: Faster than AsyncStorage (2-5x improvement)
5. **Zustand stores**: Minimal re-renders, selective subscription
6. **Theme caching**: useTheme hook memoizes color palette

## Testing Strategy

- **Unit Testing**: Vitest suite for core logic and algorithms
  - `src/services/lunar/__tests__/converter.test.ts`: 100% coverage for solar/lunar conversions
- **Data Validation**: Zod schemas for all form inputs and store state
  - `src/types/schemas.ts`: Shared schemas for events and settings
- **UI Consistency**: Component snapshot tests (planned)
- **Integration**: Event flow tests (create → schedule → notify)
- **Accessibility**: Testing with Screen Reader and WCAG contrast check

## Security Considerations

- No API calls (offline-first)
- No external auth required
- All data stored locally in MMKV
- JSON export includes only user data (events)
- Input validation on all forms
- No sensitive credentials stored locally

## Future Extension Points

- Custom hooks for new features (useWeather, useAstro)
- New service modules (widgetService, cloudSyncService)
- Component composition for complex UI (EventWizard)
- Notification triggers beyond date-based (location, time-series)
- Integration with native calendar (CalendarKit)
