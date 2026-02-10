import { cancelNotification, scheduleEventNotification } from '@/services/notifications';
import { EventFormData, LunarEvent } from '@/types/event';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

interface EventState {
    events: LunarEvent[];

    addEvent: (data: EventFormData) => Promise<LunarEvent>;
    updateEvent: (id: string, data: Partial<EventFormData>) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    getEventsForLunarDate: (lunarDay: number, lunarMonth: number, lunarYear?: number, solarDate?: Date) => LunarEvent[];
    getEventsForMonth: (lunarMonth: number) => LunarEvent[];
    importEvents: (events: LunarEvent[]) => Promise<void>;
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

            getEventsForLunarDate: (lunarDay: number, lunarMonth: number, lunarYear?: number) => {
                // This is a legacy helper, primarily for specific lunar matches
                return get().events.filter((e) => {
                    if (e.lunarYear !== undefined) {
                        return e.lunarDay === lunarDay && e.lunarMonth === lunarMonth && e.lunarYear === lunarYear;
                    }
                    // For recurring, we just match day/month here. 
                    // Advanced recurrence should use isEventOccurring utility in UI.
                    return e.lunarDay === lunarDay && e.lunarMonth === lunarMonth;
                });
            },

            getEventsForMonth: (lunarMonth: number) => {
                return get().events.filter((e) => e.lunarMonth === lunarMonth);
            },

            importEvents: async (importedEvents: LunarEvent[]) => {
                const currentEvents = get().events;

                // Cancel all current notifications
                for (const event of currentEvents) {
                    if (event.notificationId) {
                        await cancelNotification(event.notificationId);
                    }
                }

                // Process imported events: reschedule notifications
                const processedEvents = [];
                for (const event of importedEvents) {
                    const newEvent = { ...event };
                    if (newEvent.reminderEnabled) {
                        try {
                            const notificationId = await scheduleEventNotification(newEvent);
                            newEvent.notificationId = notificationId;
                        } catch (error) {
                            console.error('Failed to reschedule notification during import:', error);
                        }
                    } else {
                        newEvent.notificationId = undefined;
                    }
                    processedEvents.push(newEvent);
                }

                set({ events: processedEvents });
            },
        }),
        {
            name: 'events-storage',
            storage: createJSONStorage(() => mmkvStorage),
            version: 1,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    // Legacy events: lunarYear: undefined means Recurring Yearly Lunar
                    if (persistedState && persistedState.events) {
                        persistedState.events = persistedState.events.map((event: any) => {
                            if (event.lunarYear === undefined && !event.recurrence) {
                                return {
                                    ...event,
                                    recurrence: { frequency: 1, unit: 'year', system: 'lunar' }
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
