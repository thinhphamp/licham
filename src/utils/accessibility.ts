/**
 * Generate accessibility label for solar/lunar dates
 */
export function getLunarDateAccessibilityLabel(
    solarDay: number,
    solarMonth: number,
    solarYear: number,
    lunarDay: number,
    lunarMonth: number,
    lunarYear: number,
    isLeapMonth: boolean,
    holiday?: string
): string {
    const solarStr = `Ngày ${solarDay} tháng ${solarMonth} năm ${solarYear}`;
    const lunarStr = `Âm lịch ngày ${lunarDay} tháng ${lunarMonth}${isLeapMonth ? ' nhuận' : ''} năm ${lunarYear}`;
    const holidayStr = holiday ? `, hôm nay là ${holiday}` : '';

    return `${solarStr}, ${lunarStr}${holidayStr}`;
}

/**
 * Generate accessibility label for an auspicious hour
 */
export function getHourAccessibilityLabel(
    hourName: string,
    startTime: string,
    endTime: string,
    isAuspicious: boolean,
    star?: string
): string {
    const timeStr = `từ ${startTime} đến ${endTime}`;
    const statusStr = isAuspicious ? 'là giờ hoàng đạo' : 'là giờ hắc đạo';
    const starStr = star ? `, sao ${star}` : '';

    return `Giờ ${hourName}, ${timeStr}, ${statusStr}${starStr}`;
}
