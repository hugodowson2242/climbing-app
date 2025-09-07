import { Alert, Text, View } from "react-native";
import Stopwatch from "./stopwatch";

export default function StopwatchDemo() {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
      }}>
        Countdown Timer Demo
      </Text>

      <Text style={{
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666'
      }}>
        30-second countdown timer (300 tenths)
      </Text>

      <Stopwatch
        duration={300}
        onComplete={() => {
          Alert.alert(
            "Timer Complete!",
            "The 30-second timer has finished.",
            [{ text: "OK" }]
          );
        }}
      />

      <Text style={{
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666'
      }}>
        60-second countdown timer (600 tenths)
      </Text>

      <Stopwatch
        duration={600}
        onComplete={() => {
          Alert.alert(
            "Timer Complete!",
            "The 60-second timer has finished.",
            [{ text: "OK" }]
          );
        }}
      />
    </View>
  );
}
