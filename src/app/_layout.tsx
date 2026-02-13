import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppState, AppStateStatus, useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { resetBadgeCount } from '@/services/notifications';
import { initializeNotifications, useNotificationListeners } from '@/services/notifications/notification-initialization';
import { initializeStorage } from '@/stores/storage';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    initializeStorage();
    initializeNotifications();

    // Reset badge when app starts or resumes
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        resetBadgeCount();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // Set up notification listeners
  useNotificationListeners();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ presentation: 'modal', title: 'Chi tiết sự kiện' }} />
        <Stack.Screen name="event/new" options={{ presentation: 'modal', title: 'Thêm sự kiện mới' }} />
        <Stack.Screen name="day/[date]" options={{ presentation: 'card', title: 'Chi tiết ngày' }} />
      </Stack>
    </ThemeProvider>
  );
}
