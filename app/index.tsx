import PlannedExerciseList from "@/components/planned-exercise-list/planned-exercise-list";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function Index() {
  const { session, athlete } = useLocalSearchParams();

  const sessionId = session ? parseInt(session as string) : null;
  const athleteId = athlete ? parseInt(athlete as string) : null;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Training Session"
        }}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 8 }}>
          {sessionId && athleteId ? (
            <PlannedExerciseList
              sessionId={sessionId}
              athleteId={athleteId}
            />
          ) : (
            <Text>No session parameters provided</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}
