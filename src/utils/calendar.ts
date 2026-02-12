import { getDayInfo } from '@/services/lunar';
import { LunarEvent } from '@/types/event';
import { isEventOccurring } from './recurrence';

/**
 * Calculates a map of dates that have events for a specific solar month.
 * This prevents repeated calculations during calendar rendering.
 */
export function getEventsMapForMonth(events: LunarEvent[], year: number, month: number): Record<string, boolean> {
    const eventsMap: Record<string, boolean> = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const solarDate = new Date(year, month - 1, day);
        const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const info = getDayInfo(day, month, year);

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
