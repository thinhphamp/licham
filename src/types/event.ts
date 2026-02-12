export type EventType = 'gio' | 'holiday' | 'personal';
export type RecurrenceMode = 'single' | 'recurring';
export type RecurrenceUnit = 'day' | 'week' | 'month' | 'year';
export type DateSystem = 'solar' | 'lunar';

export interface RecurrenceConfig {
    frequency: number;
    unit: RecurrenceUnit;
    system: DateSystem;
}

export interface LunarEvent {
    id: string;
    title: string;
    description?: string;
    lunarDay: number;
    lunarMonth: number;
    lunarYear?: number;         // Defined for single mode, undefined for backward compatible recurring
    isLeapMonth: boolean;
    type: EventType;
    recurrence?: RecurrenceConfig;
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
    recurrenceMode: RecurrenceMode;
    recurrence?: RecurrenceConfig;
    reminderEnabled: boolean;
    reminderDaysBefore: number;
    reminderTime: string;
    color?: string;
}
