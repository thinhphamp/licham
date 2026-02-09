# Phase 3: Calendar UI

## Context Links
- [Main Plan](./plan.md)
- [Research Report](./reports/01-research-report.md)
- Previous: [Phase 2: Lunar Calendar Core](./phase-02-lunar-calendar-core.md)
- Next: [Phase 4: Features](./phase-04-features.md)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-05 |
| Description | Build calendar UI with dual solar/lunar display and day detail view |
| Priority | P1 (Critical Path) |
| Status | completed |
| Effort | 16h |

---

## Key Insights

1. **react-native-calendars** provides best customization for day cell rendering
2. Custom day component needed to show lunar date below solar date
3. Marked dates API supports multiple marking types (dots, periods, custom styles)
4. iOS requires smooth 60fps scrolling - use memo and callbacks
5. Day detail modal should show auspicious hours prominently

---

## Requirements

### Functional
- R3.1: Display month calendar with solar dates
- R3.2: Show lunar date below each solar date
- R3.3: Mark holidays with distinctive styling
- R3.4: Mark user events with dots
- R3.5: Navigate between months
- R3.6: Day detail view with full lunar info
- R3.7: Display auspicious hours in day detail

### Non-Functional
- R3.8: 60fps scrolling performance
- R3.9: Accessible via VoiceOver
- R3.10: Responsive to device sizes
- R3.11: Dark mode support

---

## Architecture

### Component Hierarchy

```
CalendarScreen (app/(tabs)/index.tsx)
├── CalendarHeader
│   ├── MonthYearTitle
│   ├── NavigationArrows
│   └── TodayButton
├── Calendar (react-native-calendars)
│   └── DayCell (custom)
│       ├── SolarDate
│       ├── LunarDate
│       └── HolidayIndicator
└── DayDetailModal
    ├── DateInfo
    ├── CanChiInfo
    ├── HolidayBadge
    └── AuspiciousHours
```

### Color Scheme

```
Primary Red:     #D4382A (holidays, important)
Primary Gold:    #C4982E (auspicious)
Text Primary:    #1A1A1A (light) / #FFFFFF (dark)
Text Secondary:  #666666 (light) / #AAAAAA (dark)
Background:      #FFFFFF (light) / #1A1A1A (dark)
Today Circle:    #D4382A
Selected:        #FFF3F0
Lunar Text:      #888888
Weekend:         #D4382A (Sunday), #4A90D9 (Saturday)
```

---

## Related Code Files

### File: `src/components/calendar/CalendarView.tsx`
```tsx
import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { DayCell } from './DayCell';
import { DayDetailModal } from './DayDetailModal';
import { useEventsStore } from '@/stores/eventStore';
import { solarToLunar } from '@/services/lunar';
import { getHolidayForDate } from '@/constants/holidays';

interface CalendarViewProps {
  initialDate?: string;
}

export function CalendarView({ initialDate }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const events = useEventsStore((state) => state.events);

  // Generate marked dates from events and holidays
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    // Mark events
    events.forEach((event) => {
      const dateKey = event.solarDate;
      marks[dateKey] = {
        ...marks[dateKey],
        marked: true,
        dotColor: '#D4382A',
      };
    });

    // Mark selected date
    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: '#FFF3F0',
        selectedTextColor: '#D4382A',
      };
    }

    return marks;
  }, [events, selectedDate]);

  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  }, []);

  const handleMonthChange = useCallback((month: DateData) => {
    setCurrentMonth(month.dateString);
  }, []);

  // Custom day component renderer
  const renderDay = useCallback(
    ({ date, state }: { date: DateData; state: string }) => {
      if (!date) return null;

      const { day, month, year } = date;
      const lunar = solarToLunar(day, month, year);
      const holiday = getHolidayForDate(lunar.day, lunar.month);
      const isToday = date.dateString === new Date().toISOString().split('T')[0];
      const isSelected = date.dateString === selectedDate;
      const hasEvent = events.some((e) => e.solarDate === date.dateString);

      return (
        <DayCell
          solarDay={day}
          lunarDay={lunar.day}
          lunarMonth={lunar.month}
          isToday={isToday}
          isSelected={isSelected}
          isDisabled={state === 'disabled'}
          isHoliday={!!holiday}
          holidayName={holiday?.name}
          hasEvent={hasEvent}
          onPress={() => handleDayPress(date)}
        />
      );
    },
    [selectedDate, events, handleDayPress]
  );

  return (
    <View style={styles.container}>
      <Calendar
        current={currentMonth}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markedDates={markedDates}
        dayComponent={renderDay}
        hideExtraDays={false}
        showSixWeeks={true}
        enableSwipeMonths={true}
        theme={{
          backgroundColor: '#FFFFFF',
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#666666',
          selectedDayBackgroundColor: '#FFF3F0',
          selectedDayTextColor: '#D4382A',
          todayTextColor: '#D4382A',
          dayTextColor: '#1A1A1A',
          textDisabledColor: '#CCCCCC',
          monthTextColor: '#1A1A1A',
          arrowColor: '#D4382A',
          textMonthFontWeight: '600',
          textMonthFontSize: 18,
        }}
      />

      <DayDetailModal
        visible={modalVisible}
        date={selectedDate}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
```

### File: `src/components/calendar/DayCell.tsx`
```tsx
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DayCellProps {
  solarDay: number;
  lunarDay: number;
  lunarMonth: number;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isHoliday: boolean;
  holidayName?: string;
  hasEvent: boolean;
  onPress: () => void;
}

export const DayCell = memo(function DayCell({
  solarDay,
  lunarDay,
  lunarMonth,
  isToday,
  isSelected,
  isDisabled,
  isHoliday,
  hasEvent,
  onPress,
}: DayCellProps) {
  // Format lunar date - show month on day 1
  const lunarText = lunarDay === 1 ? `${lunarDay}/${lunarMonth}` : `${lunarDay}`;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selected,
        isToday && styles.today,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={`Ngày ${solarDay}, âm lịch ${lunarDay} tháng ${lunarMonth}`}
      accessibilityHint={isHoliday ? 'Ngày lễ' : undefined}
    >
      {/* Solar date */}
      <Text
        style={[
          styles.solarText,
          isDisabled && styles.disabledText,
          isToday && styles.todayText,
          isHoliday && styles.holidayText,
        ]}
      >
        {solarDay}
      </Text>

      {/* Lunar date */}
      <Text
        style={[
          styles.lunarText,
          isDisabled && styles.disabledText,
          lunarDay === 1 && styles.lunarFirstDay,
          isHoliday && styles.holidayText,
        ]}
      >
        {lunarText}
      </Text>

      {/* Event indicator dot */}
      {hasEvent && <View style={styles.eventDot} />}

      {/* Holiday indicator */}
      {isHoliday && <View style={styles.holidayBar} />}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#FFF3F0',
  },
  today: {
    borderWidth: 1,
    borderColor: '#D4382A',
  },
  solarText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  lunarText: {
    fontSize: 10,
    color: '#888888',
    marginTop: 2,
  },
  lunarFirstDay: {
    color: '#D4382A',
    fontWeight: '500',
  },
  disabledText: {
    color: '#CCCCCC',
  },
  todayText: {
    color: '#D4382A',
    fontWeight: '600',
  },
  holidayText: {
    color: '#D4382A',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4382A',
  },
  holidayBar: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#D4382A',
    borderRadius: 1,
  },
});
```

### File: `src/components/calendar/DayDetailModal.tsx`
```tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDayInfo, getAuspiciousHours } from '@/services/lunar';
import { dateToJd } from '@/services/lunar';
import { AuspiciousHoursGrid } from './AuspiciousHoursGrid';

interface DayDetailModalProps {
  visible: boolean;
  date: string | null;
  onClose: () => void;
}

export function DayDetailModal({ visible, date, onClose }: DayDetailModalProps) {
  const dayInfo = useMemo(() => {
    if (!date) return null;

    const [year, month, day] = date.split('-').map(Number);
    const info = getDayInfo(day, month, year);
    const jd = dateToJd(day, month, year);
    const hours = getAuspiciousHours(jd);

    return { ...info, auspiciousHours: hours };
  }, [date]);

  if (!dayInfo) return null;

  const { solar, lunar, yearCanChi, monthCanChi, dayCanChi, zodiacAnimal, holiday, auspiciousHours } = dayInfo;

  // Format solar date
  const solarDateStr = new Date(date!).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format lunar date
  const lunarDateStr = `Ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? ' nhuận' : ''} năm ${yearCanChi.fullName}`;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết ngày</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {/* Date Display */}
          <View style={styles.dateSection}>
            <Text style={styles.solarDate}>{solarDateStr}</Text>
            <Text style={styles.lunarDate}>{lunarDateStr}</Text>

            {holiday && (
              <View style={styles.holidayBadge}>
                <Ionicons name="star" size={14} color="#C4982E" />
                <Text style={styles.holidayText}>{holiday.name}</Text>
              </View>
            )}
          </View>

          {/* Can Chi Info */}
          <View style={styles.canChiSection}>
            <Text style={styles.sectionTitle}>Can Chi</Text>
            <View style={styles.canChiGrid}>
              <View style={styles.canChiItem}>
                <Text style={styles.canChiLabel}>Năm</Text>
                <Text style={styles.canChiValue}>{yearCanChi.fullName}</Text>
                <Text style={styles.canChiSub}>({zodiacAnimal})</Text>
              </View>
              <View style={styles.canChiItem}>
                <Text style={styles.canChiLabel}>Tháng</Text>
                <Text style={styles.canChiValue}>{monthCanChi.fullName}</Text>
              </View>
              <View style={styles.canChiItem}>
                <Text style={styles.canChiLabel}>Ngày</Text>
                <Text style={styles.canChiValue}>{dayCanChi.fullName}</Text>
              </View>
            </View>
          </View>

          {/* Auspicious Hours */}
          <View style={styles.hoursSection}>
            <Text style={styles.sectionTitle}>Giờ Hoàng Đạo</Text>
            <AuspiciousHoursGrid hours={auspiciousHours} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dateSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  solarDate: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  lunarDate: {
    fontSize: 16,
    color: '#D4382A',
    marginBottom: 12,
  },
  holidayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  holidayText: {
    fontSize: 14,
    color: '#C4982E',
    fontWeight: '500',
    marginLeft: 6,
  },
  canChiSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  canChiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  canChiItem: {
    alignItems: 'center',
  },
  canChiLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  canChiValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  canChiSub: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  hoursSection: {
    paddingVertical: 16,
  },
});
```

### File: `src/components/calendar/AuspiciousHoursGrid.tsx`
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuspiciousHour } from '@/services/lunar/types';

interface AuspiciousHoursGridProps {
  hours: AuspiciousHour[];
}

export function AuspiciousHoursGrid({ hours }: AuspiciousHoursGridProps) {
  return (
    <View style={styles.container}>
      {hours.map((hour) => (
        <View
          key={hour.name}
          style={[styles.hourItem, hour.isAuspicious && styles.auspicious]}
        >
          <Text
            style={[styles.hourName, hour.isAuspicious && styles.auspiciousText]}
          >
            {hour.name}
          </Text>
          <Text style={styles.hourTime}>
            {hour.startTime}-{hour.endTime}
          </Text>
          {hour.isAuspicious && hour.star && (
            <Text style={styles.starName}>{hour.star}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hourItem: {
    width: '31%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  auspicious: {
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#C4982E',
  },
  hourName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  auspiciousText: {
    color: '#C4982E',
  },
  hourTime: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  starName: {
    fontSize: 10,
    color: '#C4982E',
    marginTop: 4,
  },
});
```

### File: `src/app/(tabs)/index.tsx`
```tsx
import { StyleSheet, View } from 'react-native';
import { CalendarView } from '@/components/calendar/CalendarView';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <CalendarView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
```

### File: `src/hooks/useLunarDate.ts`
```tsx
import { useMemo } from 'react';
import { getDayInfo } from '@/services/lunar';

export function useLunarDate(date: Date | string) {
  return useMemo(() => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return getDayInfo(d.getDate(), d.getMonth() + 1, d.getFullYear());
  }, [date]);
}
```

### File: `src/hooks/useAuspiciousHours.ts`
```tsx
import { useMemo } from 'react';
import { dateToJd, getAuspiciousHours, getOnlyAuspiciousHours } from '@/services/lunar';

export function useAuspiciousHours(date: Date | string, onlyAuspicious = false) {
  return useMemo(() => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const jd = dateToJd(d.getDate(), d.getMonth() + 1, d.getFullYear());

    return onlyAuspicious ? getOnlyAuspiciousHours(jd) : getAuspiciousHours(jd);
  }, [date, onlyAuspicious]);
}
```

---

## Implementation Steps

### Step 1: Install and Configure react-native-calendars (1h)
```bash
npm install react-native-calendars
```
Verify basic calendar renders.

### Step 2: Create DayCell Component (2h)
- Build custom day cell with lunar date
- Style for today, selected, disabled states
- Add holiday indicator
- Test with different states

### Step 3: Implement CalendarView (3h)
- Integrate Calendar with custom day component
- Wire up marked dates
- Implement month navigation
- Connect to events store

### Step 4: Build Day Detail Modal (3h)
- Create modal structure
- Display lunar date info
- Show Can Chi information
- Integrate holiday display

### Step 5: Create AuspiciousHoursGrid (2h)
- Build 12-hour grid layout
- Style auspicious vs regular hours
- Show star names for auspicious hours
- Test accessibility

### Step 6: Create Hooks (1h)
- `useLunarDate` for component consumption
- `useAuspiciousHours` for hour grid

### Step 7: Style and Polish (2h)
- Apply color scheme
- Test dark mode
- Ensure consistent spacing
- VoiceOver labels

### Step 8: Performance Optimization (2h)
- Memo day cells
- Profile scrolling
- Optimize re-renders
- Test on older devices

---

## Todo List

- [x] Integrate `react-native-calendars`
- [x] Design and implementation of custom `DayCell`
- [x] Display solar and lunar dates in grid
- [x] Implement holiday and event markers on calendar
- [x] Create `DayDetailModal` with full lunar details
- [x] Implement `AuspiciousHoursGrid` component
- [x] Display Zodiac animal and Can Chi in details
- [x] Add accessibility labels for lunar dates
- [x] Optimize calendar performance (memoization)
- [x] Implement dark mode support for calendar elements
- [ ] Create useLunarDate hook
- [ ] Create useAuspiciousHours hook
- [ ] Wire up CalendarScreen
- [ ] Add month navigation
- [ ] Test holiday marking
- [ ] Add VoiceOver accessibility
- [ ] Profile and optimize performance
- [ ] Test on iPhone SE (smaller screen)
- [ ] Test dark mode (future)

---

## Success Criteria

- [ ] Calendar displays correctly with month navigation
- [ ] Lunar dates shown below solar dates
- [ ] Holidays visually distinguished (red text, bar)
- [ ] Day 1 of lunar month shows month number
- [ ] Tapping day opens detail modal
- [ ] Modal shows full lunar info + Can Chi
- [ ] Auspicious hours display correctly
- [ ] 60fps scrolling (no jank)
- [ ] VoiceOver reads dates correctly
- [ ] Works on iPhone SE to iPhone Pro Max

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Calendar library limitations | Medium | Low | Custom day component gives full control |
| Performance with calculations | Medium | Medium | Memo calculations, lazy compute |
| Modal animation stutter | Low | Low | Use native driver |
| Layout issues on small screens | Medium | Medium | Test on SE, responsive design |

---

## Security Considerations

- No sensitive data displayed
- Event data from local store only
- No external API calls in this phase

---

## Next Steps

After completing Phase 3:
1. Verify calendar renders correctly
2. Test all interaction states
3. Commit with message: "Phase 3: Calendar UI with lunar dates"
4. Proceed to [Phase 4: Features](./phase-04-features.md)
