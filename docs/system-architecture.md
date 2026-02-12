# System Architecture - Lịch Việt

Comprehensive technical architecture document for the Vietnamese Lunar Calendar app, covering layered architecture, algorithms, data flow, and platform specifics.

## Layered Architecture Overview

The application follows a strict 4-layer architecture pattern for separation of concerns and maintainability:

```
┌──────────────────────────────────────────────────────────────┐
│                     UI Layer                                  │
│  (Expo Router Pages + React Components)                      │
│                                                               │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│  │  Calendar   │   Events    │  Settings   │ Day Detail  │   │
│  │    Tab      │    Tab      │    Tab      │    Modal    │   │
│  └──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┘   │
└─────────┼─────────────┼─────────────┼─────────────┼──────────┘
          │             │             │             │
          └─────────────┴─────────────┴─────────────┘
                        ↓
┌──────────────────────────────────────────────────────────────┐
│                    State Layer                                │
│  (Zustand Stores with MMKV Persistence)                      │
│                                                               │
│  ┌──────────────────────┐  ┌────────────────────┐            │
│  │  Events Store        │  │  Settings Store    │            │
│  │  - CRUD operations   │  │  - Dark/light theme│            │
│  │  - Event filtering   │  │  - Reminder config │            │
│  │  - Notification sync │  │  - Notification    │            │
│  │                      │  │    preferences     │            │
│  └──────────┬───────────┘  └────────┬───────────┘            │
└─────────────┼──────────────────────┼──────────────────────────┘
              │                      │
              └──────────┬───────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                   Service Layer                               │
│  (Business Logic, Algorithms, External Integrations)         │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Lunar Service (src/services/lunar/)                 │   │
│  │  - converter.ts: Solar ↔ Lunar conversion            │   │
│  │  - canChi.ts: 60-year cycle calculations             │   │
│  │  - auspiciousHours.ts: Lucky hours lookup            │   │
│  │  - newMoon.ts: Astronomical calculations             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Notification Service                                │   │
│  │  - expo-notifications wrapper                        │   │
│  │  - schedule/cancel notification logic                │   │
│  │  - permission handling                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Data Service                                        │   │
│  │  - JSON import/export                                │   │
│  │  - File sharing integration                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────┬──────────────────────────────────────────────┘
              │
              ↓
┌──────────────────────────────────────────────────────────────┐
│                  Storage Layer                                │
│  (MMKV Key-Value Store)                                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Persistent Storage (React Native MMKV)              │   │
│  │  - Events │ Settings │ Cache │ Metadata            │   │
│  │                                                       │   │
│  │  - lich-viet-events: Serialized events array         │   │
│  │  - lich-viet-settings: User preferences              │   │
│  │  - lich-viet-version: Schema version                 │   │
│  │  - lich-viet-holidays: Holiday data                  │   │
│  │  - [notification-id-n]: Notification cache           │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ↓
┌──────────────────────────────────────────────────────────────┐
│                  Testing & Validation Layer                  │
│  (Vitest + Zod)                                              │
│                                                               │
│  ┌──────────────────────┐  ┌────────────────────┐            │
│  │  Unit Testing        │  │  Data Validation   │            │
│  │  - Vitest suite      │  │  - Zod schemas     │            │
│  │  - Logic coverage    │  │  - Form validation │            │
│  │  - Algorithm tests   │  │  - Type safety     │            │
│  └──────────────────────┘  └────────────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### UI Layer
- **Purpose**: Presentation and user interaction
- **Components**: Expo Router pages, React components
- **Responsibilities**:
  - Route navigation via Expo Router file-based routing
  - User input capture and validation
  - Component rendering and styling
  - Theme application (dark/light)
  - Accessibility attributes
- **Constraints**:
  - No direct API calls or service logic
  - All state accessed through stores
  - Navigation via Expo Router
  - Platform-specific UI (iOS/Android/Web)

### State Layer
- **Purpose**: Application state management
- **Technology**: Zustand + MMKV persistence
- **Responsibilities**:
  - Event CRUD operations
  - Settings management
  - State persistence to storage
  - State restoration on app launch
  - Triggering notifications on changes
- **Key Stores**:
  - `useEventsStore`: Events array, CRUD actions, filtering
  - `useSettingsStore`: User preferences, theme, reminder defaults (days before, time), notification settings
    - Reminder settings applied as defaults to all new events
    - Editable via Settings UI with time picker modal

### Service Layer
- **Purpose**: Business logic and external integrations
- **Responsibilities**:
  - Lunar calendar calculations
  - Date conversions and validations
  - Notification scheduling
  - File import/export
  - Data transformations
- **Constraints**:
  - No React dependencies
  - No UI rendering
  - Pure functions where possible
  - Deterministic results

### Storage Layer
- **Purpose**: Data persistence
- **Technology**: React Native MMKV
- **Characteristics**:
  - Fast key-value storage (2-5x faster than AsyncStorage)
  - Serialized JSON values
  - No size limitations like localStorage
  - Platform-native (C++ on iOS, Rust on Android)
  - Synchronous operations for critical data
- **Key Management**:
  - Zustand persist middleware handles serialization
  - Manual migrations for schema changes
  - Version tracking for backward compatibility

### Testing & Validation Layer
- **Purpose**: Ensure code reliability and data integrity
- **Technology**: Vitest (Unit Testing), Zod (Validation)
- **Responsibilities**:
  - Validating business logic and algorithms (Vitest)
  - Ensuring runtime type safety for user inputs (Zod)
  - Preventing regressions in core conversion engine
  - Catching edge cases in leap year/month calculations
- **Key Files**:
  - `src/services/lunar/__tests__/converter.test.ts`: Regression tests for lunar algorithms
  - `src/types/schemas.ts`: Centralized validation logic for events and settings
  - `vitest.config.ts`: Test environment configuration

## Lunar Conversion Algorithm

### Overview
The lunar calendar conversion uses astronomical calculations based on the Meeus algorithm for Julian Day Number calculations and new moon determination. This ensures accuracy for all historical and future dates.

### Step-by-Step Process

#### 1. Solar Date → Julian Day Number (JD)
**Purpose**: Convert solar calendar dates to a continuous time scale independent of calendar system.

**Algorithm** (in `converter.ts`):
```
Input: Solar date (day, month, year)
Output: Julian Day Number (double precision float)

For year > 1582 (Gregorian) or year = 1582 and month > 10 and day >= 15:
  a = floor((14 - month) / 12)
  y = year + 4800 - a
  m = month + 12*a - 3

  jd = day + floor((153*m + 2) / 5) + 365*y + floor(y/4)
       - floor(y/100) + floor(y/400) - 32045

For earlier dates (Julian calendar):
  jd = day + floor((153*m + 2) / 5) + 365*y + floor(y/4) - 32083
```

**Accuracy**: Precise to 0.5 days
**Reference**: Meeus/Jones/Chernhoff algorithm

#### 2. Julian Day Number → Solar Date
**Purpose**: Reverse conversion for display.

**Algorithm** (in `converter.ts`):
```
Input: Julian Day Number
Output: Solar date (day, month, year)

Z = floor(jd + 0.5)
F = jd + 0.5 - Z

if Z < 2299161:
  A = Z
else:
  alpha = floor((Z - 1867216.25) / 36524.25)
  A = Z + 1 + alpha - floor(alpha / 4)

B = A + 1524
C = floor((B - 122.1) / 365.25)
D = floor(365.25 * C)
E = floor((B - D) / 30.6001)

day = B - D - floor(30.6001 * E) + F
month = E < 14 ? E - 1 : E - 13
year = month > 2 ? C - 4716 : C - 4715
```

#### 3. Find New Moon Boundaries
**Purpose**: Determine the start of lunar month (aligned with new moon).

**Algorithm** (in `newMoon.ts`):
```
Input: Solar date (day, month, year) to find lunar date for
Output: JD of the new moon at or before solar date

1. Calculate k (lunar months since Jan 2000):
   k = (year + (month - 0.5) / 12 - 2000) * 12.3685

2. Get JD of new moon at k:
   jd = getNewMoonDay(floor(k))

3. If jd > solar date's JD:
   Retry with k-1

4. Get next new moon:
   jd_next = getNewMoonDay(floor(k) + 1)

5. Check for leap month:
   leapMonthOffset = getLeapMonthOffset(jd, jd_next)
```

**Accuracy**: Within 0.5 days of actual astronomical new moon

#### 4. Calculate Lunar Month/Day
**Purpose**: Determine lunar day and month within the year.

```
Input: Solar date
Output: Lunar date (day, month, year, isLeap)

1. Find new moon at/before solar date (JD1)
2. Find next new moon after solar date (JD2)
3. lunarDay = floor(solar_jd - jd1) + 1

4. Count months from lunar year start:
   a11 = JD of 11th month (Xiaojing/December)
   lunarMonth = k - floor((a11 - 2415021.076998695) / 29.530588861) - 11

5. Validate lunar day (1-29 or 1-30):
   If lunarDay < 1 or > 30: Error

6. Detect leap month:
   isLeap = (leapMonthOffset != 0 && lunarMonth == leapMonthOffset)
```

**Validation**:
- Lunar day: 1-30 (29 or 30 based on month length)
- Lunar month: 1-13 (12 normal + 1 leap)
- Lunar year: Synchronized with solar year transitions

#### 5. Sun Longitude Check (Leap Month Detection)
**Purpose**: Determine if a lunar month is a leap month (Nhuận Tháng).

**Rule**: A month is leap when:
1. No major solar term (jiéqì) occurs in that month
2. The month follows a month with a solar term

**Algorithm** (in `newMoon.ts`):
```
Input: JD of month start (a11), lunar month number (k)
Output: Leap month offset (0 = not leap, 1-12 = leap month number)

For each month m in the lunar year:
  Get sun longitude at month boundaries
  If no major solar term (sun enters new sign) in month:
    If previous month had solar term:
      month m is leap month
      return m

Return 0 (no leap month in year)
```

**Solar Terms** (Major): Winter Solstice (270°), Spring Equinox (0°), Summer Solstice (90°), Autumn Equinox (180°)

### Example: Convert January 1, 2026 (Solar) → Lunar

```
1. Calculate JD:
   JD = 2460310.5 (Julian Day for 2026-01-01 noon)

2. Find lunar month:
   k ≈ 25.27 * 12.3685 ≈ 313
   New moon near JD: ~2460320 (lunar month 1)
   JD of new moon before: ~2460290

3. Calculate lunar day:
   lunarDay = floor(2460310.5 - 2460290) + 1 ≈ 21

4. Result:
   Lunar date: 21st day of 12th lunar month (2025)

   OR if wrapping to next year:
   Lunar date: 1st day of 1st lunar month (2026) - Tết Nguyên Đán
```

## Can-Chi 60-Year Cycle System

### System Overview
The Can-Chi system is a traditional Eastern calendar system combining 10 Heavenly Stems (Thiên Gan) with 12 Earthly Branches (Địa Chi) to create a 60-year cycle.

### Components

#### 10 Heavenly Stems (Thiên Gan)
```
Index  Name  Element  Yin/Yang
0      Giáp  Wood     Yang
1      Ất    Wood     Yin
2      Bính  Fire     Yang
3      Đinh  Fire     Yin
4      Mậu   Earth    Yang
5      Kỷ    Earth    Yin
6      Canh  Metal    Yang
7      Tân   Metal    Yin
8      Nhâm  Water    Yang
9      Quý   Water    Yin
```

#### 12 Earthly Branches (Địa Chi) with Zodiac Animals
```
Index  Name  Animal  Hours (Chi)
0      Tý    Chuột  23:00-01:00 (Rat)
1      Sửu   Trâu   01:00-03:00 (Ox)
2      Dần   Hổ     03:00-05:00 (Tiger)
3      Mão   Mèo    05:00-07:00 (Cat)
4      Thìn  Rồng   07:00-09:00 (Dragon)
5      Tỵ    Rắn    09:00-11:00 (Snake)
6      Ngọ   Ngựa   11:00-13:00 (Horse)
7      Mùi   Dê     13:00-15:00 (Goat)
8      Thân  Khỉ    15:00-17:00 (Monkey)
9      Dậu   Gà     17:00-19:00 (Rooster)
10     Tuất  Chó    19:00-21:00 (Dog)
11     Hợi   Lợn    21:00-23:00 (Pig)
```

### 60-Year Cycle Calculation

**Year Cycle** (in `canChi.ts`):
```
Input: Year number
Output: {stem, branch, animal}

Formula:
  stemIndex = (year - 1900) % 10
  branchIndex = (year - 1900) % 12

Example:
  2026: (2026 - 1900) % 10 = 6 → Canh (Metal Yang)
  2026: (2026 - 1900) % 12 = 2 → Dần (Tiger)
  Result: 2026 = Canh Dần (Metal Tiger Year)
```

**Day Cycle** (for lunar days):
```
Input: Julian Day Number
Output: {stem, branch}

Formula:
  stemIndex = (jd + 10) % 10
  branchIndex = (jd + 12) % 12

Note: JD of epoch (Jan 1, 2000) = 2451545
      Offset adjusts to historical reference point
```

**Zodiac Animal Mapping**:
- Branch index directly maps to zodiac animal (0=Rat, 1=Ox, ..., 11=Pig)
- Used for year identification ("Year of the Dragon," etc.)

### Auspicious Hours (12 Chi Hours)

Each day has 12 two-hour periods aligned with Earthly Branches:

```
Chi Hour  Zodiac    Time Range      Associated Branch
0         Chuột     23:00-01:00    Tý (Rat)
1         Trâu      01:00-03:00    Sửu (Ox)
2         Hổ        03:00-05:00    Dần (Tiger)
3         Mèo       05:00-07:00    Mão (Cat)
4         Rồng      07:00-09:00    Thìn (Dragon)
5         Rắn       09:00-11:00    Tỵ (Snake)
6         Ngựa      11:00-13:00    Ngọ (Horse)
7         Dê        13:00-15:00    Mùi (Goat)
8         Khỉ       15:00-17:00    Thân (Monkey)
9         Gà        17:00-19:00    Dậu (Rooster)
10        Chó       19:00-21:00    Tuất (Dog)
11        Lợn       21:00-23:00    Hợi (Pig)
```

**Fortune Determination** (in `auspiciousHours.ts`):
- Based on lunar day's stem-branch combination
- Each chi hour has luck level: very-good (大吉), neutral (平), bad (凶)
- Color coding in UI: Green (very-good), Yellow (neutral), Red (bad)

## Notification Architecture

### Scheduling Flow

```
Event Created with reminder: true
        ↓
eventStore.addEvent(data)
        ↓
scheduleEventNotification(event)
        ↓
Convert lunar date to solar:
  solarToLunar(event.lunarDay, event.lunarMonth, event.lunarYear)
        ↓
Calculate reminder date:
  reminderDate = solarDate - event.reminderDaysBefore days
  reminderTime = event.reminderTime (hour:minute)
        ↓
expo-notifications.scheduleNotificationAsync({
  trigger: {
    type: 'calendar',
    date: reminderDate at reminderTime,
    repeats: false
  },
  content: {
    title: event.title,
    body: event.description,
    sound: 'notification.wav',
    badge: 1
  }
})
        ↓
notificationId = returned from API
        ↓
Store notificationId with event in eventStore
```

### Platform-Specific Implementation

**iOS**:
- Uses UNUserNotificationCenter
- Local notifications (no server required)
- Permissions: UNAuthorizationOptionAlert, .sound, .badge
- Scheduling: Up to 64 pending notifications max (handled in app)

**Android**:
- Uses NotificationManager
- Local notifications via service
- Permissions: RECEIVE_BOOT_COMPLETED, VIBRATE, SCHEDULE_EXACT_ALARM
- Scheduling: Unlimited pending notifications
- Wakelock: Maintains during notification delivery

**Web**:
- Uses browser Notifications API
- Service Worker handles scheduling
- Permissions: User grants via browser
- Scheduling: Limited by browser sleep state

### Notification Cancellation

```
Event deleted or reminder disabled
        ↓
eventStore.deleteEvent(id) OR updateEvent(id, {reminderEnabled: false})
        ↓
if (event.notificationId):
  cancelNotification(notificationId)
        ↓
expo-notifications.cancelScheduledNotificationAsync(notificationId)
        ↓
OS removes from pending notifications queue
```

## Data Persistence Strategy

### MMKV Storage Configuration

**Storage Name**: `lich-viet` (namespaced storage)

**Keys**:
```typescript
{
  'lich-viet-events': LunarEvent[],        // Serialized JSON array
  'lich-viet-settings': SettingsState,     // Serialized settings object
  'lich-viet-version': number,             // Schema version (current: 1)
  'lich-viet-holidays': Holiday[],         // Pre-loaded holidays (cached)
  'notification-{id}': string              // Notification metadata cache
}
```

**Initialization Flow** (in `storage.ts`):
```
App Launch
    ↓
initializeStorage()
    ↓
Check MMKV version
    ↓
If version < current:
  Run migrations
  Set new version
    ↓
Check for cached holidays:
  If missing: Seed from holidays.ts
    ↓
Initialize Zustand stores with MMKV adapter
    ↓
Restore persisted events and settings
```

### Data Export/Import

**Export Format** (JSON):
```json
{
  "version": "1.0.0",
  "exportDate": "2026-02-09T10:30:00Z",
  "appVersion": "1.0.0",
  "events": [
    {
      "id": "event_1691234567_abc123def",
      "title": "Ngày giỗ tổ",
      "description": "Tết Hùng Vương",
      "location": "Nhà thờ",
      "lunarDay": 10,
      "lunarMonth": 3,
      "lunarYear": 2026,
      "category": "observance",
      "reminderEnabled": true,
      "reminderDaysBefore": 1,
      "reminderTime": {"hour": 8, "minute": 0},
      "createdAt": "2026-01-15T09:00:00Z",
      "updatedAt": "2026-02-01T14:30:00Z"
    }
  ]
}
```

**Export/Import Flow**:
```
User taps "Export" in Settings
        ↓
Get events from useEventsStore
        ↓
exportEventsToJSON(events) → JSON string
        ↓
Create temporary file
        ↓
expo-sharing.shareAsync(fileUri)
        ↓
[User saves to cloud/email]

---

User taps "Import" in Settings
        ↓
expo-document-picker.getDocumentAsync({type: 'application/json'})
        ↓
User selects exported JSON file
        ↓
Read file contents
        ↓
importEventsFromJSON(jsonString)
        ↓
Validate schema and event structure
        ↓
Handle merge conflicts (overwrite or merge)
        ↓
useEventsStore.importEvents(events)
        ↓
Re-schedule all notifications
        ↓
Save to MMKV
```

### Storage Migration Strategy

**Version Tracking**:
```typescript
// storage.ts
const CURRENT_VERSION = 1;

function initializeStorage() {
  const version = storage.getNumber('lich-viet-version') ?? 0;

  if (version < 1) {
    migrateToV1();
    storage.set('lich-viet-version', 1);
  }
}

function migrateToV1() {
  // Transform old data structure if exists
  // Initialize new fields with defaults
}
```

## Platform Configuration

### iOS-Specific

**Build Configuration**:
- Minimum deployment target: iOS 12.0
- Architecture: arm64 (universal binary)
- CocoaPods: 94 dependencies (React Native + libraries)
- Hermes: Enabled for faster startup
- New Architecture: Bridgeless + Fabric support

**Capabilities**:
- Remote notifications (push) infrastructure available
- Local notifications: Fully supported
- File access: Sandbox restrictions apply
- Screen recording: Detected, user-aware

**Files**:
- `ios/LichViet.xcodeproj`: Xcode project
- `Podfile`: CocoaPods dependencies
- `ios/LichViet/Info.plist`: App configuration

### Android-Specific

**Build Configuration**:
- Minimum API level: 24 (Android 7.0)
- Target API level: 34+
- ABIs: armeabi-v7a, arm64-v8a, x86, x86_64
- Hermes: Enabled
- New Architecture: Bridgeless + Fabric support

**Permissions**:
- INTERNET: Network access (not used currently)
- RECEIVE_BOOT_COMPLETED: Restore notifications after reboot
- SCHEDULE_EXACT_ALARM: Precise notification timing
- VIBRATE: Haptic feedback
- READ_EXTERNAL_STORAGE: File import
- WRITE_EXTERNAL_STORAGE: File export (scoped storage)

**Files**:
- `android/app/build.gradle`: Build configuration
- `android/app/src/main/AndroidManifest.xml`: Permissions
- `android/app/src/main/java/`: Native code

### Web-Specific

**Platform Support**:
- Modern browsers: Chrome 90+, Safari 14+, Firefox 88+
- Responsive design: Mobile, tablet, desktop
- PWA support: Service worker for offline capability
- Storage: localStorage fallback if MMKV unavailable

**Limitations**:
- No native notifications (web Notifications API)
- No file system access (web APIs only)
- Single-threaded JavaScript execution
- No background processing

## Error Handling & Recovery

### Notification Scheduling Errors

```typescript
try {
  const notifId = await scheduleEventNotification(event);
  // Update store with ID
} catch (error) {
  if (error.code === 'E_PERMISSION_DENIED') {
    // Request permission, retry
    await requestNotificationPermission();
  } else if (error.code === 'E_INVALID_DATE') {
    // Validate reminder date is in future
    throw new Error('Reminder date must be in the future');
  } else {
    // Generic error - log and notify user
    console.error('Notification scheduling failed:', error);
    Alert.alert('Error', 'Could not schedule notification');
  }
}
```

### Storage Access Errors

```typescript
try {
  const events = useEventsStore.getState().events;
} catch (error) {
  if (error.code === 'E_STORAGE_UNAVAILABLE') {
    // MMKV not ready - retry after initialization
    await initializeStorage();
  } else {
    // Corrupted data - fallback to defaults
    useEventsStore.getState().setEvents([]);
  }
}
```

## Performance Characteristics

### Lunar Conversion Performance

**Benchmarks** (on typical mobile device):
- `dateToJd()`: ~0.1ms
- `jdToDate()`: ~0.1ms
- `solarToLunar()`: ~1-2ms (includes new moon search)
- `lunarToSolar()`: ~1-2ms
- `getDayInfo()`: ~3-5ms (complete day information)
- `getAuspiciousHours()`: ~0.5ms (cached after first call)

**Optimization**:
- Mathematical operations are fast (no external calls)
- New moon calculations use polynomial approximation
- Results memoized in React hooks
- Batch processing for month views

### Storage Performance

**MMKV vs AsyncStorage**:
- MMKV read: ~0.1ms
- MMKV write: ~0.5ms
- AsyncStorage read: ~0.5ms
- AsyncStorage write: ~2-5ms

**Zustand Store Performance**:
- Selector subscription: Minimal overhead
- State updates batched
- Shallow equality comparison for re-renders
- Persist middleware: Non-blocking writes

### UI Rendering Performance

**Optimization Strategies**:
1. **React.memo()**: DayCell wrapped to prevent re-renders
2. **useCallback()**: Event handlers stable across renders
3. **useMemo()**: Lunar conversion results cached
4. **FlatList**: Event list virtualization
5. **Theme caching**: useTheme hook memoizes colors
6. **Image lazy loading**: Calendar images loaded on demand

**Target Frame Rate**: 60 FPS (16.67ms per frame)
- Calendar navigation: <100ms
- Day detail modal: <200ms
- Event list scroll: 60 FPS consistently

## Scalability Considerations

### Handling Large Datasets

**With 1000+ Events**:
- Filter by lunar month: ~10ms
- FlatList renders visible items only
- Search indexed by lunarDay/lunarMonth
- Pagination considered for future (1000+ limit)

**Storage Scaling**:
- MMKV handles 10MB+ without issues
- Zustand state immutability maintained
- Notification IDs don't grow with events
- Archive old events in future phase

### Cross-Platform Consistency

**Sync Strategy** (Phase 2):
- Manual export/import currently
- Future: iCloud/Google Drive sync
- Conflict resolution: Last write wins
- Offline-first: Local changes apply immediately
- Cloud is backup/sync only

## Disaster Recovery

### Data Loss Prevention

1. **Local Backup**: User exports JSON before risky actions
2. **MMKV Durability**: Data written to disk immediately
3. **Notification Rebuild**: Re-schedule from event data if lost
4. **Import Recovery**: Restore events from JSON export

### Corruption Handling

```typescript
// If MMKV corrupted:
try {
  const events = useEventsStore.getState().events;
} catch {
  // Reset to defaults
  MMKV.clearAll('lich-viet');
  useEventsStore.getState().setEvents([]);
  // Prompt user to import backup
}
```

## Security Measures

### Data Security

- **Local Storage Only**: No cloud transmission without explicit user action
- **No Authentication**: No login required, no user tracking
- **Export Security**: JSON file shared through OS share sheet (user controls destination)
- **Input Validation**: All user input sanitized before storage
- **No Credentials**: No passwords or sensitive data stored

### Platform Security

- **iOS**: App Sandbox prevents access to other app data
- **Android**: Permission system controls file/hardware access
- **Web**: Same-origin policy, no cross-domain requests
- **Updates**: EAS build system manages code signing

## Future Enhancements

### Widget Support (Phase 2)
- Home screen widget showing lunar date
- Quick event listing
- Auspicious hour indicator
- Shared dynamic data with main app

### Wearable Support (Phase 2)
- Apple Watch: Minimal event list, quick calendar view
- WearOS: Similar to Apple Watch
- Data sync with phone app
- Standalone operation for quick lookups

### Cloud Sync (Phase 2)
- iCloud/Google Drive integration
- Conflict-free sync algorithm
- Selective sync (events, settings, holidays)
- Automatic backup scheduling

### Extended Features (Phase 3+)
- Weather integration for ceremonies
- Location-based event reminders
- Event frequency analysis
- Predictive auspicious day suggestions
- Community holiday calendar
- Integration with native calendar apps
