import { CHI, getDayChi } from './canChi';
import { AuspiciousHour } from './types';

// Giờ hoàng đạo lookup by day's Chi index
// Each array contains indices of auspicious hour Chi (0-11)
// Based on traditional Vietnamese almanac
const AUSPICIOUS_HOURS_BY_DAY_CHI: Record<number, number[]> = {
    0: [0, 1, 4, 5, 8, 9],    // Ngày Tý: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
    1: [2, 3, 6, 7, 10, 11],  // Ngày Sửu: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
    2: [0, 1, 4, 5, 8, 9],    // Ngày Dần: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
    3: [2, 3, 6, 7, 10, 11],  // Ngày Mão: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
    4: [0, 1, 4, 5, 8, 9],    // Ngày Thìn: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
    5: [2, 3, 6, 7, 10, 11],  // Ngày Tỵ: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
    6: [0, 1, 4, 5, 8, 9],    // Ngày Ngọ: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
    7: [2, 3, 6, 7, 10, 11],  // Ngày Mùi: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
    8: [0, 1, 4, 5, 8, 9],    // Ngày Thân: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
    9: [2, 3, 6, 7, 10, 11],  // Ngày Dậu: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
    10: [0, 1, 4, 5, 8, 9],    // Ngày Tuất: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
    11: [2, 3, 6, 7, 10, 11],  // Ngày Hợi: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
};

// Six auspicious stars (Lục Hoàng Đạo)
const AUSPICIOUS_STARS = [
    'Thanh Long',   // Azure Dragon - most auspicious
    'Minh Đường',   // Bright Hall
    'Kim Quỹ',      // Golden Cabinet
    'Thiên Đức',    // Heavenly Virtue
    'Ngọc Đường',   // Jade Hall
    'Tư Mệnh',      // Commanding Fate
];

// Hour time ranges
const HOUR_TIMES: [string, string][] = [
    ['23:00', '01:00'], // Tý
    ['01:00', '03:00'], // Sửu
    ['03:00', '05:00'], // Dần
    ['05:00', '07:00'], // Mão
    ['07:00', '09:00'], // Thìn
    ['09:00', '11:00'], // Tỵ
    ['11:00', '13:00'], // Ngọ
    ['13:00', '15:00'], // Mùi
    ['15:00', '17:00'], // Thân
    ['17:00', '19:00'], // Dậu
    ['19:00', '21:00'], // Tuất
    ['21:00', '23:00'], // Hợi
];

/**
 * Get all 12 hours with auspicious status for a given Julian Day
 */
export function getAuspiciousHours(jd: number): AuspiciousHour[] {
    const dayChi = getDayChi(jd);
    const auspiciousIndices = AUSPICIOUS_HOURS_BY_DAY_CHI[dayChi];

    return CHI.map((name, index) => {
        const isAuspicious = auspiciousIndices.includes(index);
        const starIndex = auspiciousIndices.indexOf(index);

        return {
            name,
            startTime: HOUR_TIMES[index][0],
            endTime: HOUR_TIMES[index][1],
            isAuspicious,
            star: isAuspicious ? AUSPICIOUS_STARS[starIndex] : undefined,
        };
    });
}

/**
 * Get only auspicious hours for a day
 */
export function getOnlyAuspiciousHours(jd: number): AuspiciousHour[] {
    return getAuspiciousHours(jd).filter((h) => h.isAuspicious);
}

/**
 * Check if a specific hour is auspicious
 */
export function isHourAuspicious(hour: number, jd: number): boolean {
    const chiIndex = Math.floor(((hour + 1) % 24) / 2);
    const dayChi = getDayChi(jd);
    return AUSPICIOUS_HOURS_BY_DAY_CHI[dayChi].includes(chiIndex);
}
