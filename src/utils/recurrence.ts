import { getDayInfo } from '@/services/lunar';
import { LunarEvent } from '@/types/event';

/**
 * Checks if a recurring event occurs on a specific solar/lunar date.
 */
export function isEventOccurring(event: LunarEvent, targetDate: Date, targetLunar: { day: number, month: number, year: number, leap: boolean }): boolean {
    const start = new Date(event.createdAt);

    // Normalize dates to midnight
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (targetMidnight < startMidnight) return false;

    // Single mode check
    if (event.lunarYear !== undefined) {
        return (
            targetLunar.day === event.lunarDay &&
            targetLunar.month === event.lunarMonth &&
            targetLunar.year === event.lunarYear &&
            targetLunar.leap === event.isLeapMonth
        );
    }

    // Legacy recurring (no recurrence config) = Yearly Lunar
    if (!event.recurrence) {
        return (
            targetLunar.day === event.lunarDay &&
            targetLunar.month === event.lunarMonth &&
            targetLunar.leap === event.isLeapMonth
        );
    }

    const { frequency, unit, system } = event.recurrence;

    if (system === 'solar') {
        const diffDays = Math.floor((targetMidnight.getTime() - startMidnight.getTime()) / (24 * 3600 * 1000));

        switch (unit) {
            case 'day':
                return diffDays % frequency === 0;
            case 'week':
                return diffDays % (frequency * 7) === 0;
            case 'month':
                const monthsDiff = (targetMidnight.getFullYear() - startMidnight.getFullYear()) * 12 + (targetMidnight.getMonth() - startMidnight.getMonth());
                // Match day of month
                return targetMidnight.getDate() === start.getDate() && monthsDiff % frequency === 0;
            case 'year':
                const yearsDiff = targetMidnight.getFullYear() - startMidnight.getFullYear();
                return (
                    targetMidnight.getDate() === start.getDate() &&
                    targetMidnight.getMonth() === start.getMonth() &&
                    yearsDiff % frequency === 0
                );
        }
    } else {
        // Lunar system
        const dayMatch = targetLunar.day === event.lunarDay;
        const monthMatch = targetLunar.month === event.lunarMonth;
        const leapMatch = targetLunar.leap === event.isLeapMonth;

        switch (unit) {
            case 'day':
            case 'week':
                // Absolute time diff
                const diffDays = Math.floor((targetMidnight.getTime() - startMidnight.getTime()) / (24 * 3600 * 1000));
                const interval = unit === 'day' ? frequency : frequency * 7;
                return diffDays % interval === 0;
            case 'month':
                // Every N lunar months on same day
                // To accurately count lunar months between dates is hard without an absolute index.
                // For now, if frequency is 1, return dayMatch. If > 1, approximate based on years.
                if (frequency === 1) return dayMatch;

                // Very basic approximation for freq > 1
                const startInfo = getDayInfo(start.getDate(), start.getMonth() + 1, start.getFullYear());
                const totalMonthsApprox = (targetLunar.year - startInfo.lunar.year) * 12 + (targetLunar.month - startInfo.lunar.month);
                return dayMatch && totalMonthsApprox % frequency === 0;
            case 'year':
                // Every N lunar years on same day/month
                if (!dayMatch || !monthMatch || !leapMatch) return false;
                const startYearInfo = getDayInfo(start.getDate(), start.getMonth() + 1, start.getFullYear());
                const yearsDiff = targetLunar.year - startYearInfo.lunar.year;
                return yearsDiff % frequency === 0;
        }
    }

    return false;
}
