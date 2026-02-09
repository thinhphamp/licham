import { EventForm } from '@/components/events/EventForm';
import { useEventsStore } from '@/stores/eventStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { events, updateEvent, deleteEvent } = useEventsStore();

    const event = events.find((e) => e.id === id);

    if (!event) {
        return null;
    }

    const handleUpdate = async (data: any) => {
        await updateEvent(id, data);
        router.back();
    };

    const handleDelete = () => {
        Alert.alert(
            'Xóa sự kiện',
            'Bạn có chắc chắn muốn xóa sự kiện này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteEvent(id);
                        router.back();
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Delete button in header would be nice, but we'll put it in the footer of form or as a button */}
            <EventForm
                initialData={event}
                onSubmit={handleUpdate}
                onCancel={() => router.back()}
            />

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={24} color="#D4382A" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    deleteButton: {
        position: 'absolute',
        bottom: 34,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF3F0',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
});
