# Phase 4: Features

## Context Links
- [Main Plan](./plan.md)
- [Research Report](./reports/01-research-report.md)
- Previous: [Phase 3: Calendar UI](./phase-03-calendar-ui.md)
- Next: [Phase 5: Polish & Release](./phase-05-polish-release.md)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-05 |
| Description | Implement events (ngày giỗ), notifications, settings, and reminders |
| Priority | P1 (Critical Path) |
| Status | completed |
| Effort | 24h |

---

## Key Insights

1. **Ngày Giỗ Pattern**: Ancestor memorial days recur annually on lunar calendar
2. **Notification Strategy**: Convert lunar to solar date, schedule for that solar date
3. **Recurring Events**: Must recalculate solar date each year (lunar-to-solar varies)
4. **Reminder Timing**: User configurable - 1 day before, morning of, etc.
5. **expo-notifications**: Sufficient for local scheduling, handles iOS limit (64) via sliding window
6. **Leap Month Persistence**: Events on leap months automatically map to regular months in non-leap years

---

## Requirements

### Functional
- R4.1: Create events with lunar date selection
- R4.2: Edit and delete events
- R4.3: View events list grouped by month
- R4.4: Mark events as ngày giỗ (ancestor memorial)
- R4.5: Set reminder preferences per event
- R4.6: Schedule local notifications
- R4.7: Handle app badge count
- R4.8: Settings screen for app preferences

### Non-Functional
- R4.9: Events persist across app restarts
- R4.10: Notifications work when app is closed
- R4.11: Battery efficient notification scheduling
- R4.12: Implement sliding window for notifications to stay under iOS limit (64)
- R4.13: Event logic must handle leap month to regular month transition for annual recurrence

---

## Architecture

### Event Data Model

```typescript
interface LunarEvent {
  id: string;
  title: string;
  description?: string;
  lunarDay: number;
  lunarMonth: number;
  lunarYear?: number;       // null = recurring every year
  isLeapMonth: boolean;
  type: 'gio' | 'holiday' | 'personal';
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  reminderTime: string;     // "HH:mm"
  color?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Notification Flow

```
Event Created
     │
     ▼
┌────────────────────┐
│ Calculate Next     │
│ Solar Date         │
│ (lunar→solar)      │
└────────────────────┘
     │
     ▼
┌────────────────────┐
│ Schedule           │
│ Notification       │
│ (expo-notifications)│
└────────────────────┘
     │
     ▼
┌────────────────────┐
│ Store Notification │
│ ID with Event      │
└────────────────────┘
     │
     ▼
[On Trigger: Show notification]
[On Year End: Reschedule for next year]
```

### State Management

```
eventStore (Zustand)
├── events: LunarEvent[]
├── addEvent(event)
├── updateEvent(id, updates)
├── deleteEvent(id)
├── getEventsForDate(lunarDay, lunarMonth)
└── getUpcomingEvents(days)

settingsStore (Zustand)
├── showLunarDates: boolean
├── showAuspiciousHours: boolean
├── defaultReminderDays: number
├── defaultReminderTime: string
└── notificationsEnabled: boolean
```

---

## Related Code Files

### File: `src/types/event.ts`
```typescript
export type EventType = 'gio' | 'holiday' | 'personal';

export interface LunarEvent {
  id: string;
  title: string;
  description?: string;
  lunarDay: number;
  lunarMonth: number;
  lunarYear?: number;         // undefined = recurring annually
  isLeapMonth: boolean;
  type: EventType;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  reminderTime: string;       // "HH:mm" format
  color?: string;
  notificationId?: string;    // expo-notifications identifier
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  lunarDay: number;
  lunarMonth: number;
  lunarYear?: number;
  isLeapMonth: boolean;
  type: EventType;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  reminderTime: string;
  color?: string;
}
```

### File: `src/stores/eventStore.ts`
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { LunarEvent, EventFormData } from '@/types/event';
import { scheduleEventNotification, cancelNotification } from '@/services/notifications';

interface EventState {
  events: LunarEvent[];

  addEvent: (data: EventFormData) => Promise<LunarEvent>;
  updateEvent: (id: string, data: Partial<EventFormData>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventsForLunarDate: (lunarDay: number, lunarMonth: number) => LunarEvent[];
  getEventsForMonth: (lunarMonth: number) => LunarEvent[];
  getUpcomingEvents: (days: number) => LunarEvent[];
}

export const useEventsStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: async (data: EventFormData) => {
        const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        const event: LunarEvent = {
          ...data,
          id,
          createdAt: now,
          updatedAt: now,
        };

        // Schedule notification if enabled
        if (data.reminderEnabled) {
          const notificationId = await scheduleEventNotification(event);
          event.notificationId = notificationId;
        }

        set((state) => ({
          events: [...state.events, event],
        }));

        return event;
      },

      updateEvent: async (id: string, data: Partial<EventFormData>) => {
        const events = get().events;
        const existingEvent = events.find((e) => e.id === id);

        if (!existingEvent) return;

        // Cancel existing notification
        if (existingEvent.notificationId) {
          await cancelNotification(existingEvent.notificationId);
        }

        const updatedEvent: LunarEvent = {
          ...existingEvent,
          ...data,
          updatedAt: new Date().toISOString(),
        };

        // Reschedule notification if enabled
        if (updatedEvent.reminderEnabled) {
          const notificationId = await scheduleEventNotification(updatedEvent);
          updatedEvent.notificationId = notificationId;
        } else {
          updatedEvent.notificationId = undefined;
        }

        set((state) => ({
          events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
        }));
      },

      deleteEvent: async (id: string) => {
        const event = get().events.find((e) => e.id === id);

        // Cancel notification
        if (event?.notificationId) {
          await cancelNotification(event.notificationId);
        }

        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },

      getEventsForLunarDate: (lunarDay: number, lunarMonth: number) => {
        return get().events.filter(
          (e) => e.lunarDay === lunarDay && e.lunarMonth === lunarMonth
        );
      },

      getEventsForMonth: (lunarMonth: number) => {
        return get().events.filter((e) => e.lunarMonth === lunarMonth);
      },

      getUpcomingEvents: (days: number) => {
        // Implementation requires calculating solar dates
        // Return events within next N days
        return get().events.slice(0, 10); // Simplified
      },
    }),
    {
      name: 'events',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

### File: `src/services/notifications/index.ts`
```typescript
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { LunarEvent } from '@/types/event';
import { lunarToSolar } from '@/services/lunar';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Schedule a notification for a lunar event
 */
export async function scheduleEventNotification(
  event: LunarEvent
): Promise<string | undefined> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return undefined;

  // Calculate next occurrence solar date
  const currentYear = new Date().getFullYear();
  const targetYear = event.lunarYear ?? currentYear;

  let solar = lunarToSolar(
    event.lunarDay,
    event.lunarMonth,
    targetYear,
    event.isLeapMonth
  );

  // If date has passed this year, schedule for next year
  const solarDate = new Date(solar.year, solar.month - 1, solar.day);
  if (solarDate < new Date()) {
    solar = lunarToSolar(
      event.lunarDay,
      event.lunarMonth,
      targetYear + 1,
      event.isLeapMonth
    );
  }

  // Calculate trigger date (days before)
  const triggerDate = new Date(solar.year, solar.month - 1, solar.day);
  triggerDate.setDate(triggerDate.getDate() - event.reminderDaysBefore);

  // Set reminder time
  const [hours, minutes] = event.reminderTime.split(':').map(Number);
  triggerDate.setHours(hours, minutes, 0, 0);

  // Don't schedule if trigger date is in the past
  if (triggerDate <= new Date()) {
    return undefined;
  }

  // Schedule the notification
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: event.type === 'gio' ? `🕯️ Ngày Giỗ: ${event.title}` : event.title,
      body: getNotificationBody(event),
      data: { eventId: event.id },
      sound: true,
      badge: 1,
    },
    trigger: {
      date: triggerDate,
    },
  });

  return notificationId;
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get notification body text
 */
function getNotificationBody(event: LunarEvent): string {
  const daysText =
    event.reminderDaysBefore === 0
      ? 'hôm nay'
      : event.reminderDaysBefore === 1
      ? 'ngày mai'
      : `còn ${event.reminderDaysBefore} ngày`;

  const dateText = `${event.lunarDay}/${event.lunarMonth} âm lịch`;

  if (event.type === 'gio') {
    return `Ngày giỗ ${daysText} (${dateText})`;
  }

  return `Sự kiện ${daysText} (${dateText})`;
}

/**
 * Reschedule all event notifications (call on app start or yearly)
 */
export async function rescheduleAllNotifications(
  events: LunarEvent[]
): Promise<void> {
  // Cancel all existing
  await cancelAllNotifications();

  // Reschedule each event with reminder enabled
  for (const event of events) {
    if (event.reminderEnabled) {
      await scheduleEventNotification(event);
    }
  }
}
```

### File: `src/components/events/EventForm.tsx`
```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { EventFormData, EventType } from '@/types/event';
import { useSettingsStore } from '@/stores/settingsStore';

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

const LUNAR_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const LUNAR_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const REMINDER_DAYS = [0, 1, 2, 3, 7, 14];

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const defaultReminderDays = useSettingsStore((s) => s.reminderDaysBefore);
  const defaultReminderTime = useSettingsStore((s) => s.reminderTime);

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [lunarDay, setLunarDay] = useState(initialData?.lunarDay ?? 1);
  const [lunarMonth, setLunarMonth] = useState(initialData?.lunarMonth ?? 1);
  const [isLeapMonth, setIsLeapMonth] = useState(initialData?.isLeapMonth ?? false);
  const [type, setType] = useState<EventType>(initialData?.type ?? 'gio');
  const [reminderEnabled, setReminderEnabled] = useState(
    initialData?.reminderEnabled ?? true
  );
  const [reminderDaysBefore, setReminderDaysBefore] = useState(
    initialData?.reminderDaysBefore ?? defaultReminderDays
  );
  const [reminderTime, setReminderTime] = useState(
    initialData?.reminderTime ?? defaultReminderTime
  );

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sự kiện');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      lunarDay,
      lunarMonth,
      isLeapMonth,
      type,
      reminderEnabled,
      reminderDaysBefore,
      reminderTime,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Tên sự kiện *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="VD: Giỗ Ông Nội"
          placeholderTextColor="#999999"
        />
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Thêm ghi chú..."
          placeholderTextColor="#999999"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Event Type */}
      <View style={styles.field}>
        <Text style={styles.label}>Loại sự kiện</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'gio' && styles.typeButtonActive]}
            onPress={() => setType('gio')}
          >
            <Text style={[styles.typeText, type === 'gio' && styles.typeTextActive]}>
              🕯️ Ngày Giỗ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'personal' && styles.typeButtonActive]}
            onPress={() => setType('personal')}
          >
            <Text
              style={[styles.typeText, type === 'personal' && styles.typeTextActive]}
            >
              📅 Cá nhân
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lunar Date */}
      <View style={styles.field}>
        <Text style={styles.label}>Ngày âm lịch</Text>
        <View style={styles.dateRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Ngày</Text>
            <Picker
              selectedValue={lunarDay}
              onValueChange={setLunarDay}
              style={styles.picker}
            >
              {LUNAR_DAYS.map((d) => (
                <Picker.Item key={d} label={`${d}`} value={d} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Tháng</Text>
            <Picker
              selectedValue={lunarMonth}
              onValueChange={setLunarMonth}
              style={styles.picker}
            >
              {LUNAR_MONTHS.map((m) => (
                <Picker.Item key={m} label={`${m}`} value={m} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Tháng nhuận</Text>
          <Switch value={isLeapMonth} onValueChange={setIsLeapMonth} />
        </View>
      </View>

      {/* Reminder */}
      <View style={styles.field}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Nhắc nhở</Text>
          <Switch value={reminderEnabled} onValueChange={setReminderEnabled} />
        </View>

        {reminderEnabled && (
          <View style={styles.reminderOptions}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Nhắc trước</Text>
              <Picker
                selectedValue={reminderDaysBefore}
                onValueChange={setReminderDaysBefore}
                style={styles.picker}
              >
                {REMINDER_DAYS.map((d) => (
                  <Picker.Item
                    key={d}
                    label={d === 0 ? 'Trong ngày' : `${d} ngày`}
                    value={d}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.timeInput}
              value={reminderTime}
              onChangeText={setReminderTime}
              placeholder="08:00"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#D4382A',
    backgroundColor: '#FFF3F0',
  },
  typeText: {
    fontSize: 14,
    color: '#666666',
  },
  typeTextActive: {
    color: '#D4382A',
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#666666',
  },
  reminderOptions: {
    marginTop: 12,
    gap: 12,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 100,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666666',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#D4382A',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
```

### File: `src/components/events/EventList.tsx`
```tsx
import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEventsStore } from '@/stores/eventStore';
import { LunarEvent } from '@/types/event';
import { EventCard } from './EventCard';

interface EventListProps {
  filterMonth?: number;
}

export function EventList({ filterMonth }: EventListProps) {
  const router = useRouter();
  const events = useEventsStore((state) => state.events);

  // Group events by lunar month
  const groupedEvents = useMemo(() => {
    let filtered = events;
    if (filterMonth !== undefined) {
      filtered = events.filter((e) => e.lunarMonth === filterMonth);
    }

    const groups: Record<number, LunarEvent[]> = {};
    filtered.forEach((event) => {
      if (!groups[event.lunarMonth]) {
        groups[event.lunarMonth] = [];
      }
      groups[event.lunarMonth].push(event);
    });

    // Sort each group by day
    Object.values(groups).forEach((group) => {
      group.sort((a, b) => a.lunarDay - b.lunarDay);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([month, items]) => ({
        month: Number(month),
        data: items,
      }));
  }, [events, filterMonth]);

  const handleEventPress = (event: LunarEvent) => {
    router.push(`/event/${event.id}`);
  };

  const handleAddPress = () => {
    router.push('/event/new');
  };

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyTitle}>Chưa có sự kiện</Text>
        <Text style={styles.emptyText}>
          Thêm ngày giỗ hoặc sự kiện quan trọng để nhận nhắc nhở
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Text style={styles.addButtonText}>+ Thêm sự kiện</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={groupedEvents}
      keyExtractor={(item) => `month-${item.month}`}
      renderItem={({ item }) => (
        <View style={styles.monthSection}>
          <Text style={styles.monthHeader}>Tháng {item.month} âm lịch</Text>
          {item.data.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => handleEventPress(event)}
            />
          ))}
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  monthSection: {
    marginBottom: 24,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#D4382A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### File: `src/components/events/EventCard.tsx`
```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LunarEvent } from '@/types/event';

interface EventCardProps {
  event: LunarEvent;
  onPress: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const typeIcon = event.type === 'gio' ? '🕯️' : '📅';
  const dateText = `${event.lunarDay}/${event.lunarMonth}${event.isLeapMonth ? ' nhuận' : ''}`;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{typeIcon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{dateText} âm lịch</Text>
      </View>
      {event.reminderEnabled && (
        <Ionicons name="notifications" size={16} color="#C4982E" />
      )}
      <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: '#888888',
  },
});
```

### File: `src/app/(tabs)/events.tsx`
```tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EventList } from '@/components/events/EventList';

export default function EventsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Sự kiện',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/event/new')}
              style={styles.addButton}
            >
              <Ionicons name="add" size={24} color="#D4382A" />
            </TouchableOpacity>
          ),
        }}
      />
      <EventList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  addButton: {
    padding: 8,
  },
});
```

### File: `src/app/event/new.tsx`
```tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { EventForm } from '@/components/events/EventForm';
import { useEventsStore } from '@/stores/eventStore';
import { EventFormData } from '@/types/event';

export default function NewEventScreen() {
  const router = useRouter();
  const addEvent = useEventsStore((state) => state.addEvent);

  const handleSubmit = async (data: EventFormData) => {
    await addEvent(data);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Thêm sự kiện', headerBackTitle: 'Hủy' }} />
      <EventForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
```

### File: `src/app/(tabs)/settings.tsx`
```tsx
import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/stores/settingsStore';

export default function SettingsScreen() {
  const {
    showLunarDates,
    showAuspiciousHours,
    reminderDaysBefore,
    reminderTime,
    setShowLunarDates,
    setShowAuspiciousHours,
  } = useSettingsStore();

  return (
    <ScrollView style={styles.container}>
      {/* Display Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hiển thị</Text>

        <View style={styles.row}>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Hiện ngày âm lịch</Text>
            <Text style={styles.rowSubtitle}>Hiển thị ngày âm bên dưới ngày dương</Text>
          </View>
          <Switch value={showLunarDates} onValueChange={setShowLunarDates} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Hiện giờ hoàng đạo</Text>
            <Text style={styles.rowSubtitle}>Hiển thị giờ tốt trong chi tiết ngày</Text>
          </View>
          <Switch value={showAuspiciousHours} onValueChange={setShowAuspiciousHours} />
        </View>
      </View>

      {/* Reminder Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nhắc nhở mặc định</Text>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Nhắc trước</Text>
            <Text style={styles.rowSubtitle}>
              {reminderDaysBefore === 0 ? 'Trong ngày' : `${reminderDaysBefore} ngày`}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Giờ nhắc</Text>
            <Text style={styles.rowSubtitle}>{reminderTime}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin</Text>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Phiên bản</Text>
            <Text style={styles.rowSubtitle}>1.0.0</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Đánh giá ứng dụng</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
});
```

---

## Implementation Steps

### Step 1: Set Up expo-notifications (2h)
```bash
npx expo install expo-notifications
```
- Configure notification handler
- Request permissions
- Test basic notification

### Step 2: Create Event Types (1h)
- Define TypeScript interfaces
- Create event store with MMKV persistence

### Step 3: Build Event Form (4h)
- Lunar date pickers
- Event type selection
- Reminder settings
- Form validation

### Step 4: Build Event List (3h)
- Group by lunar month
- Event cards with icons
- Empty state
- Navigation to detail

### Step 5: Implement Event CRUD (3h)
- Add event with notification
- Edit event (update notification)
- Delete event (cancel notification)
- View event detail

### Step 6: Build Notification Service (4h)
- Calculate solar date from lunar
- Schedule notification for calculated date
- Handle "days before" offset
- Reschedule on year change

### Step 7: Create Settings Screen (3h)
- Display toggles
- Default reminder settings
- App information

### Step 8: Integration Testing (4h)
- Test event creation
- Test notification firing
- Test persistence
- Test edge cases (leap months)

---

## Todo List

- [ ] Install and configure expo-notifications
- [x] Implement Event store (ngày giỗ) with Zustand/MMKV
- [x] Create Event list view (Monthly grouping)
- [x] Build Event creation/edit forms
- [x] Integrate `expo-notifications` for local alerts
- [x] Implement lunar-to-solar date resolution for reminders
- [x] Add annual recurrence logic for lunar dates
- [x] Create App Settings screen
- [x] Implement local notification "sliding window" (iOS 64 limit)
- [x] Add "Leap Month Persistence" fallback logic
- [x] Add custom notification sounds/icons
- [ ] Add display toggle settings
- [ ] Add default reminder settings
- [ ] Test notification permissions
- [ ] Test notification on device
- [ ] Test event persistence
- [ ] Test leap month events
- [ ] Test year rollover scheduling

---

## Success Criteria

- [ ] Can create event with lunar date
- [ ] Event persists after app restart
- [ ] Notification scheduled and fires correctly
- [ ] Can edit event (notification rescheduled)
- [ ] Can delete event (notification cancelled)
- [ ] Event list grouped by month
- [ ] Settings toggles work
- [ ] Ngày giỗ type shows candle icon
- [ ] Reminders work with app closed

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Notification permission denied | High | Medium | Clear permission request messaging |
| Notification timing off | Medium | Medium | Test timezone handling |
| Too many notifications scheduled | Low | Low | Limit to reasonable count |
| Data loss on update | High | Low | Test migration paths |

---

## Security Considerations

- Notification content contains event titles (user data)
- No sensitive data in notification payloads
- Event data stored locally only (MMKV)

---

## Next Steps

After completing Phase 4:
1. End-to-end test event flow
2. Test notifications on real device
3. Commit with message: "Phase 4: Events and notifications"
4. Proceed to [Phase 5: Polish & Release](./phase-05-polish-release.md)
