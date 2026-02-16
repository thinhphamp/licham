import { CalendarView } from '@/components/calendar/CalendarView';
import { useTheme } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

export default function CalendarScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CalendarView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
