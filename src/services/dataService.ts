import { useEventsStore } from '@/stores/eventStore';
import { useSettingsStore } from '@/stores/settingsStore';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export async function exportData() {
    try {
        const events = useEventsStore.getState().events;
        const settings = useSettingsStore.getState();

        const settingsToExport = {
            showLunarDates: settings.showLunarDates,
            showAuspiciousHours: settings.showAuspiciousHours,
            reminderDaysBefore: settings.reminderDaysBefore,
            reminderTime: settings.reminderTime,
        };

        const data = {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            events,
            settings: settingsToExport,
        };

        const fileName = `lich_viet_backup_${new Date().toISOString().split('T')[0]}.json`;
        const fileUri = FileSystem.cacheDirectory + fileName;

        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/json',
                dialogTitle: 'Xuất dữ liệu Lịch Việt',
                UTI: 'public.json',
            });
        } else {
            Alert.alert('Lỗi', 'Tính năng chia sẻ không khả dụng trên thiết bị này');
        }
    } catch (error) {
        console.error('Export error:', error);
        Alert.alert('Lỗi', 'Không thể xuất dữ liệu');
    }
}

export async function importData() {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
        });

        if (result.canceled) return;

        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
        const data = JSON.parse(fileContent);

        // Basic validation
        if (!data.events || !Array.isArray(data.events)) {
            throw new Error('Định dạng file không hợp lệ');
        }

        Alert.alert(
            'Xác nhận',
            `Bạn có muốn nhập ${data.events.length} sự kiện và cài đặt từ file này? Dữ liệu hiện tại sẽ bị thay thế.`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Nhập',
                    style: 'destructive',
                    onPress: async () => {
                        // Update stores
                        await useEventsStore.getState().importEvents(data.events);

                        if (data.settings) {
                            const settingsStore = useSettingsStore.getState();
                            if (data.settings.showLunarDates !== undefined) settingsStore.setShowLunarDates(data.settings.showLunarDates);
                            if (data.settings.showAuspiciousHours !== undefined) settingsStore.setShowAuspiciousHours(data.settings.showAuspiciousHours);
                            if (data.settings.reminderDaysBefore !== undefined) settingsStore.setReminderDaysBefore(data.settings.reminderDaysBefore);
                            if (data.settings.reminderTime !== undefined) settingsStore.setReminderTime(data.settings.reminderTime);
                        }

                        Alert.alert('Thành công', 'Đã nhập dữ liệu thành công');
                    },
                },
            ]
        );
    } catch (error) {
        console.error('Import error:', error);
        Alert.alert('Lỗi', 'Không thể nhập dữ liệu. Vui lòng kiểm tra định dạng file.');
    }
}
