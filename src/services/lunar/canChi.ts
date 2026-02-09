import { CanChi } from './types';

// Thiên Can (Heavenly Stems)
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

// Địa Chi (Earthly Branches)
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// Vietnamese zodiac animals (same order as CHI)
const ZODIAC_ANIMALS = [
    'Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn',
    'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'
];

/**
 * Calculate Can Chi for lunar year
 */
export function getYearCanChi(lunarYear: number): CanChi {
    const canIndex = (lunarYear + 6) % 10;
    const chiIndex = (lunarYear + 8) % 12;

    return {
        can: CAN[canIndex],
        chi: CHI[chiIndex],
        fullName: `${CAN[canIndex]} ${CHI[chiIndex]}`,
        index: (canIndex * 12 + chiIndex) % 60,
    };
}

/**
 * Calculate Can Chi for lunar month
 * Depends on lunar year's Can
 */
export function getMonthCanChi(lunarMonth: number, lunarYear: number): CanChi {
    const yearCan = (lunarYear + 6) % 10;
    // First month starts from Dần (index 2)
    const chiIndex = (lunarMonth + 1) % 12;
    // Can of month depends on year's Can
    const canIndex = (yearCan * 2 + lunarMonth) % 10;

    return {
        can: CAN[canIndex],
        chi: CHI[chiIndex],
        fullName: `${CAN[canIndex]} ${CHI[chiIndex]}`,
        index: (canIndex * 12 + chiIndex) % 60,
    };
}

/**
 * Calculate Can Chi for a day using Julian Day Number
 */
export function getDayCanChi(jd: number): CanChi {
    const canIndex = (jd + 9) % 10;
    const chiIndex = (jd + 1) % 12;

    return {
        can: CAN[canIndex],
        chi: CHI[chiIndex],
        fullName: `${CAN[canIndex]} ${CHI[chiIndex]}`,
        index: (canIndex * 12 + chiIndex) % 60,
    };
}

/**
 * Calculate Can Chi for an hour
 * Hour Chi is fixed (Tý = 23:00-01:00)
 * Hour Can depends on day's Can
 */
export function getHourCanChi(hour: number, dayJd: number): CanChi {
    // Convert hour to Chi index (Tý starts at 23:00)
    const chiIndex = Math.floor(((hour + 1) % 24) / 2);

    // Hour Can depends on day's Can
    const dayCan = (dayJd + 9) % 10;
    const canIndex = (dayCan * 2 + chiIndex) % 10;

    return {
        can: CAN[canIndex],
        chi: CHI[chiIndex],
        fullName: `${CAN[canIndex]} ${CHI[chiIndex]}`,
        index: (canIndex * 12 + chiIndex) % 60,
    };
}

/**
 * Get Vietnamese zodiac animal for a lunar year
 */
export function getZodiacAnimal(lunarYear: number): string {
    const chiIndex = (lunarYear + 8) % 12;
    return ZODIAC_ANIMALS[chiIndex];
}

/**
 * Get the Chi (Earthly Branch) index for a given Julian Day
 * Used for auspicious hour calculation
 */
export function getDayChi(jd: number): number {
    return (jd + 1) % 12;
}

export { CAN, CHI, ZODIAC_ANIMALS };
