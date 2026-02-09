import { getNewMoonDay, getSunLongitude } from './newMoon';
import { LunarDate, SolarDate } from './types';

const TIMEZONE = 7; // Vietnam GMT+7

/**
 * Convert Julian Day Number to Solar Date
 */
export function jdToDate(jd: number): SolarDate {
    const Z = Math.floor(jd + 0.5);
    const F = jd + 0.5 - Z;
    let A: number;

    if (Z < 2299161) {
        A = Z;
    } else {
        const alpha = Math.floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + alpha - Math.floor(alpha / 4);
    }

    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);

    const day = B - D - Math.floor(30.6001 * E) + F;
    const month = E < 14 ? E - 1 : E - 13;
    const year = month > 2 ? C - 4716 : C - 4715;

    return { day: Math.floor(day), month, year };
}

/**
 * Convert Solar Date to Julian Day Number
 */
export function dateToJd(day: number, month: number, year: number): number {
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;

    let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4);

    if (year > 1582 || (year === 1582 && (month > 10 || (month === 10 && day >= 15)))) {
        jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    } else {
        jd = jd - 32083;
    }

    return jd;
}

/**
 * Get lunar month info for a given lunar month
 * Returns [newMoonJD, leapMonth] where leapMonth is 0 if not leap
 */
function getLunarMonth11(year: number): number {
    const off = dateToJd(31, 12, year) - 2415021;
    const k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, TIMEZONE);
    const sunLong = getSunLongitude(nm, TIMEZONE);

    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, TIMEZONE);
    }

    return nm;
}

/**
 * Determine leap month in lunar year
 * Returns 0 if no leap month, or the leap month number (1-12)
 */
function getLeapMonthOffset(a11: number): number {
    const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, TIMEZONE), TIMEZONE);

    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, TIMEZONE), TIMEZONE);
    } while (arc !== last && i < 14);

    return i - 1;
}

/**
 * Convert Solar Date to Lunar Date
 */
export function solarToLunar(dd: number, mm: number, yy: number): LunarDate {
    const dayNumber = dateToJd(dd, mm, yy);
    const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);

    let monthStart = getNewMoonDay(k + 1, TIMEZONE);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, TIMEZONE);
    }

    let a11 = getLunarMonth11(yy);
    let b11 = a11;

    let lunarYear: number;
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1);
    } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1);
    }

    const lunarDay = dayNumber - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);

    let lunarLeap = false;
    let lunarMonth = diff + 11;

    if (b11 - a11 > 365) {
        const leapMonthDiff = getLeapMonthOffset(a11);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff === leapMonthDiff) {
                lunarLeap = true;
            }
        }
    }

    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }

    return {
        day: lunarDay,
        month: lunarMonth,
        year: lunarYear,
        leap: lunarLeap,
        jd: dayNumber,
    };
}

/**
 * Convert Lunar Date to Solar Date
 */
export function lunarToSolar(
    lunarDay: number,
    lunarMonth: number,
    lunarYear: number,
    lunarLeap: boolean = false
): SolarDate {
    let a11: number, b11: number;

    if (lunarMonth < 11) {
        a11 = getLunarMonth11(lunarYear - 1);
        b11 = getLunarMonth11(lunarYear);
    } else {
        a11 = getLunarMonth11(lunarYear);
        b11 = getLunarMonth11(lunarYear + 1);
    }

    const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    let off = lunarMonth - 11;
    if (off < 0) {
        off += 12;
    }

    if (b11 - a11 > 365) {
        const leapOff = getLeapMonthOffset(a11);
        let leapMonth = leapOff - 2;
        if (leapMonth < 0) {
            leapMonth += 12;
        }
        if (lunarLeap && lunarMonth !== leapMonth) {
            return { day: 0, month: 0, year: 0 }; // Invalid leap month
        }
        if (lunarLeap || off >= leapOff) {
            off += 1;
        }
    }

    const monthStart = getNewMoonDay(k + off, TIMEZONE);
    return jdToDate(monthStart + lunarDay - 1);
}
