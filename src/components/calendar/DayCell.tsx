import { useTheme } from '@/constants/theme';
import { getLunarDateAccessibilityLabel } from '@/utils/accessibility';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DayCellProps {
    solarDay: number;
    solarMonth: number;
    solarYear: number;
    lunarDay: number;
    lunarMonth: number;
    lunarYear: number;
    isLeapMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    isHoliday: boolean;
    holidayName?: string;
    hasEvent: boolean;
    onPress: () => void;
}

export const DayCell = memo(function DayCell({
    solarDay,
    solarMonth,
    solarYear,
    lunarDay,
    lunarMonth,
    lunarYear,
    isLeapMonth,
    isToday,
    isSelected,
    isDisabled,
    isHoliday,
    holidayName,
    hasEvent,
    onPress,
}: DayCellProps) {
    const theme = useTheme();

    // Format lunar date - show month on day 1
    const lunarText = lunarDay === 1 ? `${lunarDay}/${lunarMonth}` : `${lunarDay}`;

    // Accessibility label
    const accessibilityLabel = getLunarDateAccessibilityLabel(
        solarDay, solarMonth, solarYear,
        lunarDay, lunarMonth, lunarYear,
        isLeapMonth, holidayName
    );

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isSelected && { backgroundColor: theme.selected },
                isToday && { borderWidth: 1, borderColor: theme.today },
            ]}
            onPress={onPress}
            disabled={isDisabled}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={hasEvent ? 'Có sự kiện đã lưu' : 'Nhấn để xem chi tiết'}
        >
            {/* Solar date */}
            <Text
                style={[
                    styles.solarText,
                    { color: theme.text },
                    isDisabled && { color: theme.textMuted },
                    isToday && { color: theme.today, fontWeight: '700' },
                    isHoliday && { color: theme.holiday },
                ]}
            >
                {solarDay}
            </Text>

            {/* Lunar date */}
            <Text
                style={[
                    styles.lunarText,
                    { color: theme.lunar },
                    isDisabled && { color: theme.textMuted },
                    lunarDay === 1 && { color: theme.primary, fontWeight: '600' },
                    isHoliday && { color: theme.holiday },
                ]}
            >
                {lunarText}
            </Text>

            {/* Event indicator dot */}
            {hasEvent && <View style={[styles.eventDot, { backgroundColor: theme.primary }]} />}

            {/* Holiday indicator */}
            {isHoliday && <View style={[styles.holidayBar, { backgroundColor: theme.holiday }]} />}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    solarText: {
        fontSize: 16,
        fontWeight: '500',
    },
    lunarText: {
        fontSize: 10,
        marginTop: 2,
    },
    eventDot: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    holidayBar: {
        position: 'absolute',
        bottom: 0,
        left: 8,
        right: 8,
        height: 2,
        borderRadius: 1,
    },
});
