import { useTheme } from '@/constants/theme';
import { useEventsStore } from '@/stores/eventStore';
import { LunarEvent } from '@/types/event';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EventCard } from './EventCard';

interface EventListProps {
    filterMonth?: number;
}

export function EventList({ filterMonth }: EventListProps) {
    const theme = useTheme();
    const router = useRouter();
    const events = useEventsStore((state) => state.events);

    // Group events by lunar month
    const groupedEvents = useMemo(() => {
        let filtered = events;
        if (filterMonth !== undefined) {
            filtered = events.filter((e) => e.lunarMonth === filterMonth);
        }

        const groups: Record<number, LunarEvent[]> = {};
        filtered.forEach((event) => {
            if (!groups[event.lunarMonth]) {
                groups[event.lunarMonth] = [];
            }
            groups[event.lunarMonth].push(event);
        });

        // Sort each group by day
        Object.values(groups).forEach((group) => {
            group.sort((a, b) => a.lunarDay - b.lunarDay);
        });

        return Object.entries(groups)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([month, items]) => ({
                month: Number(month),
                data: items,
            }));
    }, [events, filterMonth]);

    const handleEventPress = (event: LunarEvent) => {
        router.push(`/event/${event.id}`);
    };

    if (events.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                    Chưa có sự kiện nào
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={groupedEvents}
            keyExtractor={(item) => item.month.toString()}
            renderItem={({ item }) => (
                <View style={styles.groupContainer}>
                    <Text style={[styles.groupHeader, { color: theme.primary }]}>
                        Tháng {item.month}
                    </Text>
                    {item.data.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onPress={() => handleEventPress(event)}
                        />
                    ))}
                </View>
            )}
            contentContainerStyle={styles.listContent}
        />
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
    },
    listContent: {
        padding: 16,
    },
    groupContainer: {
        marginBottom: 20,
    },
    groupHeader: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
});
