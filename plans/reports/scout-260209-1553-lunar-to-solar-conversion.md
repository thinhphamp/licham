# Scout Report: Lunar-to-Solar Date Conversion Files

## Summary
Located all files related to lunar-to-solar date conversion in the calendar app. The conversion system uses the Meeus algorithm with Vietnam timezone (GMT+7) and is integrated into the event form to display solar dates when lunar dates are selected.

## Core Conversion Files

### 1. Lunar Conversion Service (`src/services/lunar/`)
**Files:**
- `/Users/thinhpham/dev/calendar-app/src/services/lunar/converter.ts` - Main conversion logic
- `/Users/thinhpham/dev/calendar-app/src/services/lunar/newMoon.ts` - Astronomical calculations
- `/Users/thinhpham/dev/calendar-app/src/services/lunar/types.ts` - TypeScript interfaces
- `/Users/thinhpham/dev/calendar-app/src/services/lunar/index.ts` - Public API exports
- `/Users/thinhpham/dev/calendar-app/src/services/lunar/canChi.ts` - Can-Chi system
- `/Users/thinhpham/dev/calendar-app/src/services/lunar/auspiciousHours.ts` - Lucky hours

**Key Functions:**
- `lunarToSolar(lunarDay, lunarMonth, lunarYear, lunarLeap)` - Converts lunar → solar
- `solarToLunar(dd, mm, yy)` - Converts solar → lunar
- `dateToJd(day, month, year)` - Solar date to Julian Day Number
- `jdToDate(jd)` - Julian Day Number to solar date
- `getDayInfo(day, month, year)` - Main convenience function returning complete day info

**Algorithm Details:**
- Uses Meeus astronomical algorithm
- Vietnam timezone: GMT+7
- Handles leap months and 60-year Can-Chi cycle
- Returns SolarDate with day, month, year fields

## Event Form Integration

### 2. Event Form Component (`src/components/events/EventForm.tsx`)
**Location:** `/Users/thinhpham/dev/calendar-app/src/components/events/EventForm.tsx`

**Key Features:**
- Imports `lunarToSolar` from `@/services/lunar`
- Line 49-54: Uses `useMemo` hook to calculate solar date
- Line 193-202: Displays "Ngày dương lịch" (Solar date) in format: `DD/MM/YYYY`
- Updates solar display when lunar day/month changes
- Handles leap month flag with Switch component
- Validates conversion (returns null if day === 0)

**Code Snippet:**
```tsx
const solarDate = useMemo(() => {
    const year = initialData?.lunarYear ?? new Date().getFullYear();
    const result = lunarToSolar(lunarDay, lunarMonth, year, isLeapMonth);
    if (result.day === 0) return null;
    return result;
}, [lunarDay, lunarMonth, isLeapMonth, initialData?.lunarYear]);

// Display
{solarDate && (
    <View style={styles.solarDateRow}>
        <Text style={[styles.solarDateLabel, { color: theme.textMuted }]}>
            Ngày dương lịch:
        </Text>
        <Text style={[styles.solarDateValue, { color: theme.text }]}>
            {solarDate.day.toString().padStart(2, '0')}/{solarDate.month.toString().padStart(2, '0')}/{solarDate.year}
        </Text>
    </View>
)}
```

## Related Components

### 3. Day Detail Modal (`src/components/calendar/DayDetailModal.tsx`)
- Displays both solar and lunar dates for selected day
- Uses `dateToJd` for calculating auspicious hours
- Shows full date information including Can-Chi system
- Line 29-30: Calculates JD for auspicious hours lookup

### 4. Calendar View (`src/components/calendar/CalendarView.tsx`)
- Uses `getDayInfo` to convert solar dates to lunar dates
- Line 21: `getDayInfo(date.getDate(), date.getMonth() + 1, date.getFullYear())`
- Maps lunar day/month to events
- Handles leap month matching

## Custom Hooks

### 5. useLunarDate Hook (`src/hooks/useLunarDate.ts`)
```tsx
import { getDayInfo } from '@/services/lunar';
export function useLunarDate(date: Date | string) {
    return useMemo(() => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return getDayInfo(d.getDate(), d.getMonth() + 1, d.getFullYear());
    }, [date]);
}
```

### 6. useAuspiciousHours Hook (`src/hooks/useAuspiciousHours.ts`)
```tsx
export function useAuspiciousHours(date: Date | string, onlyAuspicious = false) {
    return useMemo(() => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const jd = dateToJd(d.getDate(), d.getMonth() + 1, d.getFullYear());
        return onlyAuspicious ? getOnlyAuspiciousHours(jd) : getAuspiciousHours(jd);
    }, [date, onlyAuspicious]);
}
```

## Event Creation Flow

### 7. New Event Screen (`src/app/event/new.tsx`)
- Routes lunar date params from day modal to event form
- Receives: `lunarDay`, `lunarMonth`, `lunarYear`, `isLeapMonth`
- Passes to EventForm as initialData

### 8. Event Detail Screen (`src/app/event/[id].tsx`)
- Loads existing event and uses EventForm for editing
- Supports update/delete operations

## Type Definitions

### 9. Type System (`src/services/lunar/types.ts`)
```tsx
export interface LunarDate {
    day: number;        // 1-30
    month: number;      // 1-12
    year: number;
    leap: boolean;      // is this a leap month?
    jd: number;         // Julian day number
}

export interface SolarDate {
    day: number;
    month: number;
    year: number;
}

export interface DayInfo {
    solar: SolarDate;
    lunar: LunarDate;
    yearCanChi: CanChi;
    monthCanChi: CanChi;
    dayCanChi: CanChi;
    zodiacAnimal: string;
    holiday?: Holiday;
}
```

## Data Flow Diagram

```
User Input (Lunar Day/Month)
    ↓
EventForm (component/events/EventForm.tsx)
    ↓
lunarToSolar() conversion (services/lunar/converter.ts)
    ├→ getLunarMonth11() - Get lunar year boundaries
    ├→ getLeapMonthOffset() - Handle leap months
    ├→ getNewMoonDay() - Astronomical calculation
    ├→ getSunLongitude() - Sun position
    └→ jdToDate() - Convert Julian Day to solar date
    ↓
Display as "Ngày dương lịch: DD/MM/YYYY"
```

## Files Summary Table

| File | Purpose | Key Function |
|------|---------|--------------|
| converter.ts | Main conversion logic | lunarToSolar, solarToLunar, dateToJd, jdToDate |
| newMoon.ts | Astronomical algorithms | getNewMoonDay, getSunLongitude |
| types.ts | TypeScript interfaces | LunarDate, SolarDate, DayInfo |
| index.ts | Public API | getDayInfo, exports |
| canChi.ts | Can-Chi system | 60-year cycle zodiac |
| auspiciousHours.ts | Lucky hours | getAuspiciousHours |
| EventForm.tsx | Event creation UI | Solar date display integration |
| DayDetailModal.tsx | Day info display | Show lunar/solar conversions |
| CalendarView.tsx | Calendar rendering | Solar to lunar mapping |
| useLunarDate.ts | React hook | Memoized day info lookup |
| useAuspiciousHours.ts | React hook | Auspicious hours lookup |
| new.tsx | Event creation page | Route params, initial data |
| [id].tsx | Event edit page | Load existing event data |

## Key Implementation Details

1. **Conversion Accuracy**: Uses Meeus algorithm for astronomical accuracy
2. **Timezone**: Vietnam GMT+7 hardcoded in converter.ts (line 4)
3. **Leap Month Handling**: Managed via boolean flag in EventForm
4. **Real-time Display**: useMemo ensures conversion recalculates when lunar inputs change
5. **Error Handling**: Returns { day: 0, month: 0, year: 0 } for invalid leap months
6. **Formatting**: Solar date padded to DD/MM/YYYY format in display

## Integration Points

- **Calendar Navigation**: CalendarView uses getDayInfo to display lunar dates on each day
- **Event Modal**: DayDetailModal passes lunar params to event creation
- **Form Submission**: EventForm validates and converts lunar → solar before saving
- **Notifications**: Event store uses lunar dates, converts to solar for notifications

