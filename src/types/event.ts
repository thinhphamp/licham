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
