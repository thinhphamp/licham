# Notifications & Recurrence: Code Snippets Reference

## 1. Event Type Definition

**File:** `src/types/event.ts`

```typescript
// Mode: Single vs Recurring
export type RecurrenceMode = 'single' | 'recurring';
export type RecurrenceUnit = 'day' | 'week' | 'month' | 'year';
export type DateSystem = 'solar' | 'lunar';
export type RecurrenceEndType = 'never' | 'on_date';

export interface RecurrenceConfig {
    frequency: number;              // How many units (e.g., every 2 weeks)
    unit: RecurrenceUnit;           // day, week, month, year
    system: DateSystem;             // lunar or solar calendar
    endType: RecurrenceEndType;     // never or on_date
    endDate?: string;               // YYYY-MM-DD format
}

export interface LunarEvent {
    id: string;
    title: string;
    lunarDay: number;               // 1-30
    lunarMonth: number;             // 1-12
    lunarYear?: number;             // Only set for single mode
    isLeapMonth: boolean;
    reminderEnabled: boolean;
    reminderDaysBefore: number;     // 0, 1, 2, 3, 7, 14
    reminderTime: string;           // "HH:mm" format
    recurrence?: RecurrenceConfig;  // Only for recurring
    notificationId?: string;        // Expo notification ID
    createdAt: string;              // ISO timestamp
    updatedAt: string;
}
```

---

## 2. Notification Scheduling Logic

**File:** `src/services/notifications/index.ts`

### Schedule Event Notification

```typescript
export async function scheduleEventNotification(
    event: LunarEvent
): Promise<string | undefined> {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return undefined;

    const currentYear = new Date().getFullYear();
    const targetYear = event.lunarYear ?? currentYear;  // undefined for recurring

    // Convert lunar to solar
    let solar = lunarToSolar(
        event.lunarDay,
        event.lunarMonth,
        targetYear,
        event.isLeapMonth
    );

    // Calculate trigger date = event date - reminder days + reminder time
    const calculateTriggerDate = (s: { day: number, month: number, year: number }) => {
        const date = new Date(s.year, s.month - 1, s.day);
        date.setDate(date.getDate() - event.reminderDaysBefore);
        const [h, m] = event.reminderTime.split(':').map(Number);
        date.setHours(h, m, 0, 0);
        return date;
    };

    let triggerDate = calculateTriggerDate(solar);

    // For recurring events: if trigger date passed, try next year
    if (triggerDate <= new Date() && !event.lunarYear) {
        console.log('[Notifications] Target passed, checking next year...');
        solar = lunarToSolar(
            event.lunarDay,
            event.lunarMonth,
            targetYear + 1,
            event.isLeapMonth
        );
        triggerDate = calculateTriggerDate(solar);
    }

    // Final check: don't schedule if still in past
    if (triggerDate <= new Date()) {
        console.log('[Notifications] Trigger date is in the past:', triggerDate);
        return undefined;
    }

    // Schedule via Expo
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: event.type === 'gio' ? `🕯️ Ngày Giỗ: ${event.title}` : event.title,
            body: getNotificationBody(event),
            data: { eventId: event.id },
            sound: true,
            badge: 1,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
        },
    });

    return notificationId;
}
```

### Notification Body Formatter

```typescript
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
```

---

## 3. Recurrence Pattern Matching

**File:** `src/utils/recurrence.ts`

```typescript
export function isEventOccurring(
    event: LunarEvent,
    targetDate: Date,
    targetLunar: { day: number, month: number, year: number, leap: boolean }
): boolean {
    const start = new Date(event.createdAt);

    // Normalize to midnight
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (targetMidnight < startMidnight) return false;

    // Single mode: exact match
    if (event.lunarYear !== undefined) {
        return (
            targetLunar.day === event.lunarDay &&
            targetLunar.month === event.lunarMonth &&
            targetLunar.year === event.lunarYear &&
            targetLunar.leap === event.isLeapMonth
        );
    }

    // Legacy: yearly lunar recurrence
    if (!event.recurrence) {
        return (
            targetLunar.day === event.lunarDay &&
            targetLunar.month === event.lunarMonth &&
            targetLunar.leap === event.isLeapMonth
        );
    }

    const { frequency, unit, system } = event.recurrence;

    // SOLAR SYSTEM PATTERNS
    if (system === 'solar') {
        const diffDays = Math.floor((targetMidnight.getTime() - startMidnight.getTime()) / (24 * 3600 * 1000));

        switch (unit) {
            case 'day':
                return diffDays % frequency === 0;
            case 'week':
                return diffDays % (frequency * 7) === 0;
            case 'month':
                const monthsDiff = (targetMidnight.getFullYear() - startMidnight.getFullYear()) * 12 
                                  + (targetMidnight.getMonth() - startMidnight.getMonth());
                return targetMidnight.getDate() === start.getDate() && monthsDiff % frequency === 0;
            case 'year':
                const yearsDiff = targetMidnight.getFullYear() - startMidnight.getFullYear();
                return (
                    targetMidnight.getDate() === start.getDate() &&
                    targetMidnight.getMonth() === start.getMonth() &&
                    yearsDiff % frequency === 0
                );
        }
    }

    // LUNAR SYSTEM PATTERNS
    else {
        const dayMatch = targetLunar.day === event.lunarDay;
        const monthMatch = targetLunar.month === event.lunarMonth;
        const leapMatch = targetLunar.leap === event.isLeapMonth;

        switch (unit) {
            case 'day':
            case 'week':
                const diffDays = Math.floor((targetMidnight.getTime() - startMidnight.getTime()) / (24 * 3600 * 1000));
                const interval = unit === 'day' ? frequency : frequency * 7;
                return diffDays % interval === 0;
            case 'month':
                if (frequency === 1) return dayMatch;
                const totalMonthsApprox = (targetLunar.year - lunaryear) * 12 + (targetLunar.month - event.lunarMonth);
                return dayMatch && totalMonthsApprox % frequency === 0;
            case 'year':
                if (!dayMatch || !monthMatch || !leapMatch) return false;
                const yearsDiff = targetLunar.year - event.lunarYear;
                return yearsDiff % frequency === 0;
        }
    }

    return false;
}
```

---

## 4. Event Store Notification Integration

**File:** `src/stores/eventStore.ts`

```typescript
export const useEventsStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: [],

            // Add event with notification
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

            // Update event and reschedule notification
            updateEvent: async (id: string, data: Partial<EventFormData>) => {
                const events = get().events;
                const existingEvent = events.find((e) => e.id === id);

                if (!existingEvent) return;

                // Cancel old notification
                if (existingEvent.notificationId) {
                    await cancelNotification(existingEvent.notificationId);
                }

                const updatedEvent: LunarEvent = {
                    ...existingEvent,
                    ...data,
                    updatedAt: new Date().toISOString(),
                };

                // Reschedule if enabled
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

            // Delete event and cancel notification
            deleteEvent: async (id: string) => {
                const event = get().events.find((e) => e.id === id);

                if (event?.notificationId) {
                    await cancelNotification(event.notificationId);
                }

                set((state) => ({
                    events: state.events.filter((e) => e.id !== id),
                }));
            },
        }),
        {
            name: 'events-storage',
            storage: createJSONStorage(() => mmkvStorage),
            version: 1,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    // Auto-migrate legacy recurring events
                    if (persistedState?.events) {
                        persistedState.events = persistedState.events.map((event: any) => {
                            if (event.lunarYear === undefined && !event.recurrence) {
                                return {
                                    ...event,
                                    recurrence: { 
                                        frequency: 1, 
                                        unit: 'year', 
                                        system: 'lunar' 
                                    }
                                };
                            }
                            return event;
                        });
                    }
                }
                return persistedState;
            },
        }
    )
);
```

---

## 5. Notification Listeners Setup

**File:** `src/services/notifications/notification-initialization.ts`

```typescript
export function useNotificationListeners(): void {
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        // Listen for notifications in foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log('[Notifications] Received in foreground:', notification);
                // Handler config in index.ts handles display
            }
        );

        // Listen for user tapping notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log('[Notifications] User response:', response);
                Notifications.setBadgeCountAsync(0);

                const eventId = response.notification.request.content.data?.eventId;
                if (eventId && typeof eventId === 'string') {
                    console.log('[Notifications] Navigating to event:', eventId);
                    router.push(`/event/${eventId}`);
                }
            }
        );

        // Handle cold start (app launched from notification)
        Notifications.getLastNotificationResponseAsync().then((response) => {
            if (response) {
                console.log('[Notifications] App launched from notification:', response);
                Notifications.setBadgeCountAsync(0);
                const eventId = response.notification.request.content.data?.eventId;
                if (eventId && typeof eventId === 'string') {
                    setTimeout(() => {
                        router.push(`/event/${eventId}`);
                    }, 500);
                }
            }
        });

        // Cleanup
        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);
}
```

---

## 6. Calendar Event Mapping

**File:** `src/utils/calendar.ts`

```typescript
export function getEventsMapForMonth(
    events: LunarEvent[],
    year: number,
    month: number
): Record<string, boolean> {
    const eventsMap: Record<string, boolean> = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const solarDate = new Date(year, month - 1, day);
        const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Get lunar equivalent of this solar date
        const info = getDayInfo(day, month, year);

        // Check if any event occurs on this date
        const hasEvent = events.some(event => isEventOccurring(event, solarDate, {
            day: info.lunar.day,
            month: info.lunar.month,
            year: info.lunar.year,
            leap: info.lunar.leap
        }));

        if (hasEvent) {
            eventsMap[dateString] = true;
        }
    }

    return eventsMap;
}
```

---

## 7. Form Validation

**File:** `src/types/schemas.ts`

```typescript
export const EventFormDataSchema = z.object({
    title: z.string().min(1, 'Tiêu đề không được để trống').max(100),
    description: z.string().optional(),
    lunarDay: z.number().int().min(1).max(31),
    lunarMonth: z.number().int().min(1).max(12),
    lunarYear: z.number().int().min(1900).max(2100).optional(),
    isLeapMonth: z.boolean(),
    type: z.enum(['gio', 'holiday', 'personal']),
    recurrenceMode: z.enum(['single', 'recurring']),
    recurrence: RecurrenceConfigSchema.optional(),
    reminderEnabled: z.boolean(),
    reminderDaysBefore: z.number().int().min(0).max(30),
    reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ không hợp lệ'),
    color: z.string().optional(),
}).refine((data) => {
    // Recurring mode requires recurrence config
    if (data.recurrenceMode === 'recurring' && !data.recurrence) {
        return false;
    }
    return true;
}, {
    message: "Cấu hình lặp lại là bắt buộc cho chế độ lặp lại",
    path: ["recurrence"],
});
```

---

## Key Differences: Single vs Recurring

| Aspect | Single | Recurring |
|--------|--------|-----------|
| `lunarYear` | Set to specific year | Undefined |
| Notification | Scheduled once, fires on date | Scheduled for next occurrence only |
| Pattern Matching | Exact date match | Dynamic `isEventOccurring()` check |
| Calendar Display | Shows only on selected year | Shows on all matching dates |
| End Date | N/A | Can specify end date |
| Frequency | N/A | 1+ intervals per day/week/month/year |
| System | N/A | Solar or Lunar calendar |

