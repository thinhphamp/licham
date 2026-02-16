import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

type ThemeMode = 'system' | 'light' | 'dark';

interface SettingsState {
    showLunarDates: boolean;
    showAuspiciousHours: boolean;
    reminderDaysBefore: number;
    reminderTime: string; // "HH:mm"
    themeMode: ThemeMode;

    setShowLunarDates: (show: boolean) => void;
    setShowAuspiciousHours: (show: boolean) => void;
    setReminderDaysBefore: (days: number) => void;
    setReminderTime: (time: string) => void;
    setThemeMode: (mode: ThemeMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            showLunarDates: true,
            showAuspiciousHours: true,
            reminderDaysBefore: 1,
            reminderTime: '08:00',
            themeMode: 'system',

            setShowLunarDates: (show) => set({ showLunarDates: show }),
            setShowAuspiciousHours: (show) => set({ showAuspiciousHours: show }),
            setReminderDaysBefore: (days) => set({ reminderDaysBefore: days }),
            setReminderTime: (time) => set({ reminderTime: time }),
            setThemeMode: (mode) => set({ themeMode: mode }),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
);
