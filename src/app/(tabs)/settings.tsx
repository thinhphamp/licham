import { useTheme } from '@/constants/theme';
import { exportData, importData } from '@/services/dataService';
import { useSettingsStore } from '@/stores/settingsStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const theme = useTheme();
    const {
        showLunarDates,
        showAuspiciousHours,
        reminderDaysBefore,
        reminderTime,
        setShowLunarDates,
        setShowAuspiciousHours,
    } = useSettingsStore();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surfaceAlt }]}>
            <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Hiển thị</Text>

                <View style={[styles.row, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Hiện ngày âm trên lịch</Text>
                    <Switch
                        value={showLunarDates}
                        onValueChange={setShowLunarDates}
                        trackColor={{ false: theme.border, true: theme.primary }}
                    />
                </View>

                <View style={[styles.row, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Hiện giờ hoàng đạo</Text>
                    <Switch
                        value={showAuspiciousHours}
                        onValueChange={setShowAuspiciousHours}
                        trackColor={{ false: theme.border, true: theme.primary }}
                    />
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Nhắc nhở mặc định</Text>

                <View style={[styles.row, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Nhắc trước (ngày)</Text>
                    <Text style={[styles.valueText, { color: theme.textSecondary }]}>{reminderDaysBefore}</Text>
                </View>

                <View style={[styles.row, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Giờ nhắc</Text>
                    <Text style={[styles.valueText, { color: theme.textSecondary }]}>{reminderTime}</Text>
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Dữ liệu</Text>
                <TouchableOpacity
                    style={[styles.row, { borderBottomColor: theme.border }]}
                    onPress={exportData}
                >
                    <Text style={[styles.label, { color: theme.text }]}>Sao lưu dữ liệu (Xuất file)</Text>
                    <Ionicons name="share-outline" size={20} color={theme.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.row, { borderBottomColor: 'transparent' }]}
                    onPress={importData}
                >
                    <Text style={[styles.label, { color: theme.text }]}>Khôi phục dữ liệu (Nhập file)</Text>
                    <Ionicons name="download-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Ứng dụng</Text>
                <View style={[styles.row, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Phiên bản</Text>
                    <Text style={[styles.valueText, { color: theme.textSecondary }]}>1.0.0</Text>
                </View>

                <TouchableOpacity style={[styles.row, { borderBottomColor: 'transparent' }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Phản hồi & Góp ý</Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.border} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginTop: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 13,
        marginLeft: 16,
        marginBottom: 8,
        marginTop: 16,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    label: {
        fontSize: 16,
    },
    valueText: {
        fontSize: 16,
    },
});
