// Main public API for lunar calendar service
export { getHolidayForDate, getHolidaysForMonth, MONTHLY_OBSERVANCES, VIETNAMESE_HOLIDAYS } from '../../constants/holidays';
export { getAuspiciousHours, getOnlyAuspiciousHours, isHourAuspicious } from './auspiciousHours';
export { CAN, CHI, getDayCanChi, getHourCanChi, getMonthCanChi, getYearCanChi, getZodiacAnimal } from './canChi';
export { dateToJd, jdToDate, lunarToSolar, solarToLunar } from './converter';
export type { AuspiciousHour, CanChi, DayInfo, Holiday, LunarDate, SolarDate } from './types';

import { getHolidayForDate } from '../../constants/holidays';
import { getDayCanChi, getMonthCanChi, getYearCanChi, getZodiacAnimal } from './canChi';
import { dateToJd, solarToLunar } from './converter';
import { DayInfo, Holiday } from './types';

/**
 * Get complete day information for a solar date
 * This is the main convenience function
 */
export function getDayInfo(day: number, month: number, year: number): DayInfo & { holiday?: Holiday } {
    const lunar = solarToLunar(day, month, year);
    const jd = dateToJd(day, month, year);

    return {
        solar: { day, month, year },
        lunar,
        yearCanChi: getYearCanChi(lunar.year),
        monthCanChi: getMonthCanChi(lunar.month, lunar.year),
        dayCanChi: getDayCanChi(jd),
        zodiacAnimal: getZodiacAnimal(lunar.year),
        holiday: getHolidayForDate(lunar.day, lunar.month),
    };
}
