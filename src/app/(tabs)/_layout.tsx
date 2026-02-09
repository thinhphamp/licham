import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = '#D4382A'; // Vietnamese red

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lịch',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Sự kiện',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
