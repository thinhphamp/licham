import { EventForm } from '@/components/events/EventForm';
import { useEventsStore } from '@/stores/eventStore';
import { useRouter } from 'expo-router';
import React from 'react';

export default function NewEventScreen() {
    const router = useRouter();
    const addEvent = useEventsStore((state) => state.addEvent);

    const handleSubmit = async (data: any) => {
        await addEvent(data);
        router.back();
    };

    return (
        <EventForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    );
}
