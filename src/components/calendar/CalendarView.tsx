import { useTheme } from '@/constants/theme';
import { getDayInfo } from '@/services/lunar';
import { useEventsStore } from '@/stores/eventStore';
import { getEventsMapForMonth } from '@/utils/calendar';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { DayCell } from './DayCell';
import { DayDetailModal } from './DayDetailModal';
import { MonthYearPickerModal } from './MonthYearPickerModal';

// Separate memoized wrapper to prevent unnecessary re-renders of individual day cells
const CalendarDay = memo(({ date, state, isSelected, hasEvent, onDayPress }: any) => {
    // We still need info for lunar display, but this is less expensive than checking all events
    const info = useMemo(() => getDayInfo(date.day, date.month, date.year), [date.day, date.month, date.year]);

    const handlePress = useCallback(() => {
        onDayPress(date);
    }, [onDayPress, date]);

    return (
        <DayCell
            solarDay={date.day}
            solarMonth={date.month}
            solarYear={date.year}
            lunarDay={info.lunar.day}
            lunarMonth={info.lunar.month}
            lunarYear={info.lunar.year}
            isLeapMonth={info.lunar.leap}
            isToday={state === 'today'}
            isSelected={isSelected}
            isDisabled={state === 'disabled'}
            isHoliday={!!info.holiday}
            holidayName={info.holiday?.name}
            hasEvent={hasEvent}
            onPress={handlePress}
        />
    );
});

export function CalendarView() {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(today);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const events = useEventsStore((state) => state.events);
    const theme = useTheme();
    const { width: screenWidth } = useWindowDimensions();

    const dayInfo = useMemo(() => {
        const date = new Date(selectedDate);
        return getDayInfo(date.getDate(), date.getMonth() + 1, date.getFullYear());
    }, [selectedDate]);

    // Pre-calculate event map for the current month
    const eventsMap = useMemo(() => {
        const date = new Date(currentMonth);
        return getEventsMapForMonth(events, date.getFullYear(), date.getMonth() + 1);
    }, [events, currentMonth]);

    const markedDates = useMemo(() => {
        return {
            [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
            },
        };
    }, [selectedDate]);

    const goToToday = useCallback(() => {
        const now = new Date().toISOString().split('T')[0];
        setSelectedDate(now);
        setCurrentMonth(now);
    }, []);

    const handleDayPress = useCallback((date: any) => {
        setSelectedDate(date.dateString);
        setIsModalVisible(true);
    }, []);

    const renderDay = useCallback(({ date, state }: any) => {
        if (!date) return null;

        return (
            <CalendarDay
                date={date}
                state={state}
                isSelected={selectedDate === date.dateString}
                hasEvent={!!eventsMap[date.dateString]}
                onDayPress={handleDayPress}
            />
        );
    }, [selectedDate, eventsMap, handleDayPress]);

    const onMonthChange = useCallback((month: DateData) => {
        setCurrentMonth(month.dateString);
    }, []);

    const handleMonthSelect = useCallback((year: number, month: number) => {
        const newDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        setCurrentMonth(newDate);
        setIsPickerVisible(false);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Calendar
                key={currentMonth}
                current={currentMonth}
                markedDates={markedDates}
                dayComponent={renderDay}
                onMonthChange={onMonthChange}
                firstDay={1}
                enableSwipeMonths={true}
                theme={{
                    calendarBackground: theme.background,
                    textSectionTitleColor: theme.textSecondary,
                    monthTextColor: theme.text,
                    dayTextColor: theme.text,
                    textDisabledColor: theme.textMuted,
                    dotColor: theme.primary,
                    selectedDotColor: '#ffffff',
                    todayTextColor: theme.today,
                    arrowColor: theme.primary,
                    textMonthFontWeight: '600',
                    textMonthFontSize: 18,
                    // @ts-ignore
                    'stylesheet.calendar.main': {
                        container: {
                            paddingLeft: 0,
                            paddingRight: 0,
                            backgroundColor: theme.background,
                        },
                    },
                    'stylesheet.calendar.header': {
                        header: {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginTop: 6,
                            alignItems: 'center',
                        },
                    },
                }}
                renderArrow={(direction: string) => (
                    <Ionicons
                        name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                        size={24}
                        color={theme.primary}
                    />
                )}
                renderHeader={(date: any) => {
                    const monthName = date.toString('MMMM yyyy');
                    return (
                        <View style={[styles.header, { width: screenWidth - 100 }]}>
                            <TouchableOpacity
                                style={styles.headerTitleContainer}
                                onPress={() => setIsPickerVisible(true)}
                                activeOpacity={0.6}
                            >
                                <Text
                                    style={[styles.headerText, { color: theme.text }]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {monthName}
                                </Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={16}
                                    color={theme.textSecondary}
                                    style={styles.headerChevron}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.todayButton,
                                    { borderColor: theme.today, backgroundColor: theme.isDark ? theme.surface : theme.background }
                                ]}
                                onPress={goToToday}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.todayButtonText, { color: theme.today }]}>
                                    Hôm nay
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            />

            <MonthYearPickerModal
                visible={isPickerVisible}
                onClose={() => setIsPickerVisible(false)}
                onSelect={handleMonthSelect}
                currentYear={new Date(currentMonth).getFullYear()}
                currentMonth={new Date(currentMonth).getMonth() + 1}
            />

            {dayInfo && (
                <DayDetailModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    dayInfo={dayInfo}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        flexShrink: 1,
        marginRight: 8,
    },
    headerChevron: {
        marginLeft: 2,
    },
    todayButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        flexShrink: 0,
    },
    todayButtonText: {
        fontSize: 12, // Reduced from 13
        fontWeight: '600',
    },
});
