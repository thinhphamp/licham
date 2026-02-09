import { useTheme } from '@/constants/theme';
import { AuspiciousHour } from '@/services/lunar/types';
import { getHourAccessibilityLabel } from '@/utils/accessibility';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AuspiciousHoursGridProps {
    hours: AuspiciousHour[];
}

export function AuspiciousHoursGrid({ hours }: AuspiciousHoursGridProps) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            {hours.map((hour) => {
                const accessibilityLabel = getHourAccessibilityLabel(
                    hour.name,
                    hour.startTime,
                    hour.endTime,
                    hour.isAuspicious,
                    hour.star
                );

                return (
                    <View
                        key={hour.name}
                        style={[
                            styles.hourItem,
                            { backgroundColor: theme.surface },
                            hour.isAuspicious && {
                                backgroundColor: theme.isDark ? '#3A3010' : '#FFF9E6',
                                borderColor: theme.auspicious,
                                borderWidth: 1,
                            },
                        ]}
                        accessible
                        accessibilityLabel={accessibilityLabel}
                    >
                        <Text
                            style={[
                                styles.hourName,
                                { color: theme.textSecondary },
                                hour.isAuspicious && { color: theme.auspicious },
                            ]}
                        >
                            {hour.name}
                        </Text>
                        <Text style={[styles.hourTime, { color: theme.textMuted }]}>
                            {hour.startTime}-{hour.endTime}
                        </Text>
                        {hour.isAuspicious && hour.star && (
                            <Text style={[styles.starName, { color: theme.auspicious }]}>
                                {hour.star}
                            </Text>
                        )}
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    hourItem: {
        width: '31%',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    hourName: {
        fontSize: 14,
        fontWeight: '600',
    },
    hourTime: {
        fontSize: 11,
        marginTop: 2,
    },
    starName: {
        fontSize: 10,
        marginTop: 4,
    },
});
