import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function DayDetailScreen() {
    const { date } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết ngày</Text>
            <Text>Ngày: {date}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
