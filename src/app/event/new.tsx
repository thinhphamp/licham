import { EventForm } from '@/components/events/EventForm';
import { useEventsStore } from '@/stores/eventStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';

export default function NewEventScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        lunarDay?: string;
        lunarMonth?: string;
        lunarYear?: string;
        isLeapMonth?: string;
    }>();

    const addEvent = useEventsStore((state) => state.addEvent);

    const initialData = useMemo(() => {
        if (!params.lunarDay || !params.lunarMonth) {
            return undefined;
        }

        return {
            lunarDay: parseInt(params.lunarDay, 10),
            lunarMonth: parseInt(params.lunarMonth, 10),
            lunarYear: params.lunarYear ? parseInt(params.lunarYear, 10) : undefined,
            isLeapMonth: params.isLeapMonth === 'true',
        };
    }, [params]);

    const handleSubmit = async (data: any) => {
        await addEvent(data);
        router.back();
    };

    return (
        <EventForm
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            initialData={initialData}
        />
    );
}
