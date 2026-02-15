import { useTheme } from '@/constants/theme';
import { LunarEvent } from '@/types/event';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EventCardProps {
    event: LunarEvent;
    onPress: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
    const theme = useTheme();
    const isGio = event.type === 'gio';

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.background }]}
            onPress={onPress}
        >
            <View
                style={[
                    styles.dateIndicator,
                    { backgroundColor: theme.surface },
                    isGio && { backgroundColor: theme.selected },
                ]}
            >
                <Text style={[styles.day, { color: theme.text }]}>{event.lunarDay}</Text>
                <Text style={[styles.month, { color: theme.textSecondary }]}>Th.{event.lunarMonth}</Text>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                    {event.title}
                </Text>
                <Text style={[styles.date, { color: theme.textSecondary }]}>
                    Ngày {event.lunarDay}/{event.lunarMonth}{event.lunarYear ? `/${event.lunarYear}` : ''} âm lịch
                    {event.isLeapMonth ? ' (nhuận)' : ''}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.border} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    dateIndicator: {
        width: 48,
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    day: {
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 22,
    },
    month: {
        fontSize: 11,
        fontWeight: '500',
        lineHeight: 14,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    date: {
        fontSize: 13,
    },
});
