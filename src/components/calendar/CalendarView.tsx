import { useTheme } from '@/constants/theme';
import { getDayInfo } from '@/services/lunar';
import { useEventsStore } from '@/stores/eventStore';
import { isEventOccurring } from '@/utils/recurrence';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { DayCell } from './DayCell';
import { DayDetailModal } from './DayDetailModal';
import { MonthYearPickerModal } from './MonthYearPickerModal';

export function CalendarView() {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(today);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const events = useEventsStore((state) => state.events);
    const theme = useTheme();

    const dayInfo = useMemo(() => {
        const date = new Date(selectedDate);
        return getDayInfo(date.getDate(), date.getMonth() + 1, date.getFullYear());
    }, [selectedDate]);

    const markedDates = useMemo(() => {
        return {
            [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
            },
        };
    }, [selectedDate]);

    const goToToday = () => {
        const now = new Date().toISOString().split('T')[0];
        setSelectedDate(now);
        setCurrentMonth(now);
    };

    const renderDay = ({ date, state }: any) => {
        if (!date) return null;

        const info = getDayInfo(date.day, date.month, date.year);
        const solarDate = new Date(date.year, date.month - 1, date.day);

        const hasEvent = events.some((e) => isEventOccurring(e, solarDate, {
            day: info.lunar.day,
            month: info.lunar.month,
            year: info.lunar.year,
            leap: info.lunar.leap
        }));

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
                isSelected={selectedDate === date.dateString}
                isDisabled={state === 'disabled'}
                isHoliday={!!info.holiday}
                holidayName={info.holiday?.name}
                hasEvent={hasEvent}
                onPress={() => {
                    setSelectedDate(date.dateString);
                    setIsModalVisible(true);
                }}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Calendar
                key={currentMonth}
                current={currentMonth}
                markedDates={markedDates}
                dayComponent={renderDay}
                onDayPress={(day: DateData) => {
                    setSelectedDate(day.dateString);
                }}
                onMonthChange={(month: DateData) => {
                    setCurrentMonth(month.dateString);
                }}
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
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.headerTitleContainer}
                                onPress={() => setIsPickerVisible(true)}
                                activeOpacity={0.6}
                            >
                                <Text style={[styles.headerText, { color: theme.text }]}>
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
                onSelect={(year, month) => {
                    const newDate = `${year}-${month.toString().padStart(2, '0')}-01`;
                    setCurrentMonth(newDate);
                    setIsPickerVisible(false);
                }}
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
        width: '100%',
        paddingHorizontal: 0,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    headerChevron: {
        marginLeft: 4,
    },
    todayButton: {
        flexShrink: 0,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        borderWidth: 1,
        marginLeft: 8,
    },
    todayButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
