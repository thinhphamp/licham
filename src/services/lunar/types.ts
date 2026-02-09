export interface LunarDate {
    day: number;        // 1-30
    month: number;      // 1-12
    year: number;       // e.g., 2026
    leap: boolean;      // is this a leap month?
    jd: number;         // Julian day number
}

export interface SolarDate {
    day: number;
    month: number;
    year: number;
}

export interface CanChi {
    can: string;        // Heavenly Stem (Giáp, Ất, Bính...)
    chi: string;        // Earthly Branch (Tý, Sửu, Dần...)
    fullName: string;   // Combined name (Giáp Tý)
    index: number;      // Position in 60-year cycle (0-59)
}

export interface DayInfo {
    solar: SolarDate;
    lunar: LunarDate;
    yearCanChi: CanChi;
    monthCanChi: CanChi;
    dayCanChi: CanChi;
    zodiacAnimal: string;  // Con giáp (Tý, Sửu, Dần...)
    solarTerm?: string;    // Tiết khí if applicable
}

export interface AuspiciousHour {
    name: string;       // Tý, Sửu, etc.
    startTime: string;  // "23:00"
    endTime: string;    // "01:00"
    isAuspicious: boolean;
    star?: string;      // Thanh Long, Kim Quỹ, etc.
}

export interface Holiday {
    name: string;
    nameLatin: string;
    lunarMonth: number;
    lunarDay: number;
    description?: string;
    isNational: boolean;
}
