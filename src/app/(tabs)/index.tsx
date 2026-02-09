import { CalendarView } from '@/components/calendar/CalendarView';
import { StyleSheet, View } from 'react-native';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <CalendarView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
