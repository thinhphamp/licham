import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

interface SettingsState {
    showLunarDates: boolean;
    showAuspiciousHours: boolean;
    reminderDaysBefore: number;
    reminderTime: string; // "HH:mm"

    setShowLunarDates: (show: boolean) => void;
    setShowAuspiciousHours: (show: boolean) => void;
    setReminderDaysBefore: (days: number) => void;
    setReminderTime: (time: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            showLunarDates: true,
            showAuspiciousHours: true,
            reminderDaysBefore: 1,
            reminderTime: '08:00',

            setShowLunarDates: (show) => set({ showLunarDates: show }),
            setShowAuspiciousHours: (show) => set({ showAuspiciousHours: show }),
            setReminderDaysBefore: (days) => set({ reminderDaysBefore: days }),
            setReminderTime: (time) => set({ reminderTime: time }),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
);
