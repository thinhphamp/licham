import { useTheme } from '@/constants/theme';
import { getDayInfo } from '@/services/lunar';
import { useEventsStore } from '@/stores/eventStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { DayCell } from './DayCell';
import { DayDetailModal } from './DayDetailModal';

export function CalendarView() {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [isModalVisible, setIsModalVisible] = useState(false);
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

    const renderDay = ({ date, state }: any) => {
        if (!date) return null;

        const info = getDayInfo(date.day, date.month, date.year);
        const hasEvent = events.some(
            (e) =>
                e.lunarDay === info.lunar.day &&
                e.lunarMonth === info.lunar.month &&
                (!e.isLeapMonth || info.lunar.leap)
        );

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
                current={selectedDate}
                markedDates={markedDates}
                dayComponent={renderDay}
                onDayPress={(day: DateData) => {
                    setSelectedDate(day.dateString);
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
});
