import { Holiday } from '@/services/lunar/types';

export const VIETNAMESE_HOLIDAYS: Holiday[] = [
    // National Holidays (Lunar)
    {
        name: 'Tết Nguyên Đán',
        nameLatin: 'Tet Nguyen Dan',
        lunarMonth: 1,
        lunarDay: 1,
        description: 'Vietnamese Lunar New Year - most important holiday',
        isNational: true,
    },
    {
        name: 'Mùng 2 Tết',
        nameLatin: 'Tet Day 2',
        lunarMonth: 1,
        lunarDay: 2,
        description: 'Second day of Tet - visiting maternal family',
        isNational: true,
    },
    {
        name: 'Mùng 3 Tết',
        nameLatin: 'Tet Day 3',
        lunarMonth: 1,
        lunarDay: 3,
        description: 'Third day of Tet - visiting teachers',
        isNational: true,
    },
    {
        name: 'Tết Nguyên Tiêu',
        nameLatin: 'Tet Nguyen Tieu',
        lunarMonth: 1,
        lunarDay: 15,
        description: 'First full moon of the year - temple visits',
        isNational: false,
    },
    {
        name: 'Tết Thanh Minh',
        nameLatin: 'Tet Thanh Minh',
        lunarMonth: 3,
        lunarDay: 3,
        description: 'Tomb Sweeping Day - visit ancestral graves',
        isNational: false,
    },
    {
        name: 'Giỗ Tổ Hùng Vương',
        nameLatin: 'Hung Kings Commemoration',
        lunarMonth: 3,
        lunarDay: 10,
        description: 'Commemoration of legendary founders of Vietnam',
        isNational: true,
    },
    {
        name: 'Tết Đoan Ngọ',
        nameLatin: 'Tet Doan Ngo',
        lunarMonth: 5,
        lunarDay: 5,
        description: 'Mid-year festival - killing insects ritual',
        isNational: false,
    },
    {
        name: 'Lễ Vu Lan',
        nameLatin: 'Vu Lan Festival',
        lunarMonth: 7,
        lunarDay: 15,
        description: 'Ghost Festival - honoring ancestors and wandering spirits',
        isNational: false,
    },
    {
        name: 'Tết Trung Thu',
        nameLatin: 'Mid-Autumn Festival',
        lunarMonth: 8,
        lunarDay: 15,
        description: "Children's festival with mooncakes and lanterns",
        isNational: false,
    },
    {
        name: 'Tết Trùng Cửu',
        nameLatin: 'Double Ninth Festival',
        lunarMonth: 9,
        lunarDay: 9,
        description: 'Day to climb heights and remember ancestors',
        isNational: false,
    },
    {
        name: 'Tết Hạ Nguyên',
        nameLatin: 'Tet Ha Nguyen',
        lunarMonth: 10,
        lunarDay: 15,
        description: 'Third full moon ceremony',
        isNational: false,
    },
    {
        name: 'Ông Công Ông Táo',
        nameLatin: 'Kitchen Gods Day',
        lunarMonth: 12,
        lunarDay: 23,
        description: 'Kitchen Gods return to heaven to report',
        isNational: false,
    },
    {
        name: 'Tất Niên',
        nameLatin: 'New Year Eve',
        lunarMonth: 12,
        lunarDay: 30, // or 29 if month has 29 days
        description: 'Last day of lunar year - family reunion dinner',
        isNational: false,
    },
];

// Monthly recurring observances
export const MONTHLY_OBSERVANCES = [
    { lunarDay: 1, name: 'Mùng Một', description: 'First day of lunar month' },
    { lunarDay: 15, name: 'Rằm', description: 'Full moon day - temple visits' },
];

/**
 * Get holidays for a specific lunar month
 */
export function getHolidaysForMonth(lunarMonth: number): Holiday[] {
    return VIETNAMESE_HOLIDAYS.filter((h) => h.lunarMonth === lunarMonth);
}

/**
 * Check if a lunar date is a holiday
 */
export function getHolidayForDate(lunarDay: number, lunarMonth: number): Holiday | undefined {
    return VIETNAMESE_HOLIDAYS.find(
        (h) => h.lunarDay === lunarDay && h.lunarMonth === lunarMonth
    );
}
