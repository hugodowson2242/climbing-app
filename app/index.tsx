import PlannedExerciseList from "@/components/planned-exercise-list/planned-exercise-list";
import { ScrollView, View } from "react-native";

export default function Index() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 8 }}>
        <PlannedExerciseList />
      </View>
    </ScrollView>
  );
}
