import { useTheme } from '@/constants/theme';
import { dateToJd, getAuspiciousHours } from '@/services/lunar';
import { DayInfo } from '@/services/lunar/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AuspiciousHoursGrid } from './AuspiciousHoursGrid';

interface DayDetailModalProps {
    visible: boolean;
    onClose: () => void;
    dayInfo: DayInfo & { holiday?: any };
}

export function DayDetailModal({ visible, onClose, dayInfo }: DayDetailModalProps) {
    const theme = useTheme();
    const router = useRouter();

    const auspiciousHours = useMemo(() => {
        const jd = dateToJd(dayInfo.solar.day, dayInfo.solar.month, dayInfo.solar.year);
        return getAuspiciousHours(jd);
    }, [dayInfo.solar]);

    const {
        solar,
        lunar,
        yearCanChi,
        monthCanChi,
        dayCanChi,
        zodiacAnimal,
        holiday,
    } = dayInfo;

    const handleCreateEvent = () => {
        onClose();
        router.push({
            pathname: '/event/new',
            params: {
                lunarDay: lunar.day,
                lunarMonth: lunar.month,
                lunarYear: lunar.year,
                isLeapMonth: lunar.leap ? 'true' : 'false',
            },
        });
    };

    // Format solar date
    const solarDateStr = `Thứ ${getDayOfWeek(solar.day, solar.month, solar.year)}, ${solar.day}/${solar.month}/${solar.year}`;

    // Format lunar date
    const lunarDateStr = `Ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? ' nhuận' : ''} năm ${yearCanChi.fullName}`;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={theme.textSecondary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Chi tiết ngày</Text>
                    <TouchableOpacity onPress={handleCreateEvent} style={styles.headerAction}>
                        <Ionicons name="add" size={28} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {/* Date Display */}
                    <View style={[styles.dateSection, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.solarDate, { color: theme.text }]}>{solarDateStr}</Text>
                        <Text style={[styles.lunarDate, { color: theme.primary }]}>{lunarDateStr}</Text>

                        {holiday && (
                            <View style={[styles.holidayBadge, { backgroundColor: theme.isDark ? '#3A3010' : '#FFF9E6' }]}>
                                <Ionicons name="star" size={14} color={theme.auspicious} />
                                <Text style={[styles.holidayText, { color: theme.auspicious }]}>{holiday.name}</Text>
                            </View>
                        )}
                    </View>

                    {/* Can Chi Info */}
                    <View style={[styles.canChiSection, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Can Chi</Text>
                        <View style={styles.canChiGrid}>
                            <View style={styles.canChiItem}>
                                <Text style={[styles.canChiLabel, { color: theme.textMuted }]}>Năm</Text>
                                <Text style={[styles.canChiValue, { color: theme.text }]}>{yearCanChi.fullName}</Text>
                                <Text style={[styles.canChiSub, { color: theme.textMuted }]}>({zodiacAnimal})</Text>
                            </View>
                            <View style={styles.canChiItem}>
                                <Text style={[styles.canChiLabel, { color: theme.textMuted }]}>Tháng</Text>
                                <Text style={[styles.canChiValue, { color: theme.text }]}>{monthCanChi.fullName}</Text>
                            </View>
                            <View style={styles.canChiItem}>
                                <Text style={[styles.canChiLabel, { color: theme.textMuted }]}>Ngày</Text>
                                <Text style={[styles.canChiValue, { color: theme.text }]}>{dayCanChi.fullName}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Auspicious Hours */}
                    <View style={styles.hoursSection}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Giờ Hoàng Đạo</Text>
                        <AuspiciousHoursGrid hours={auspiciousHours} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

function getDayOfWeek(d: number, m: number, y: number): string {
    const dow = new Date(y, m - 1, d).getDay();
    const days = ['Chủ Nhật', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];
    return days[dow];
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    headerAction: {
        padding: 4,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    dateSection: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
    },
    solarDate: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    lunarDate: {
        fontSize: 16,
        marginBottom: 12,
    },
    holidayBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    holidayText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
    canChiSection: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    canChiGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    canChiItem: {
        alignItems: 'center',
    },
    canChiLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    canChiValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    canChiSub: {
        fontSize: 12,
        marginTop: 2,
    },
    hoursSection: {
        paddingVertical: 16,
    },
});
