import { ExerciseFormData, PlannedExercise } from "@/types/planned-exercise";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import Stopwatch from "../stopwatch/stopwatch";

interface ExerciseCardProps {
  exercise: PlannedExercise;
  onUpdate?: (updatedData: ExerciseFormData) => void;
}

export default function ExerciseCard({ exercise, onUpdate }: ExerciseCardProps) {
  console.log('ExerciseCard rendered with exercise:', exercise);

  const { control, handleSubmit, formState: { isDirty } } = useForm<ExerciseFormData>({
    defaultValues: {
      reps_completed: exercise.reps_completed,
      weight_used: exercise.weight_used,
      rpe: exercise.rpe,
      fatigue_level: exercise.fatigue_level,
      failure_reached: exercise.failure_reached,
      note: exercise.note,
    },
  });

  const onSubmit = (data: ExerciseFormData) => {
    if (onUpdate) {
      onUpdate(data);
      Alert.alert("Success", "Exercise data updated!");
    } else {
      Alert.alert("Info", "No update handler provided");
    }
  };

  return (
    <View style={{
      padding: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      marginBottom: 16
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        {exercise.name} (Round {exercise.round_number})
      </Text>
      <Text style={{ marginBottom: 4 }}>
        Sequence: {exercise.sequence_in_round} | Set: {exercise.set_number}
      </Text>

      {/* Prescribed vs Actual Reps */}
      <View style={{ marginBottom: 8 }}>
        <Text style={{ marginBottom: 4 }}>
          Reps: {exercise.prescribed_reps} prescribed
        </Text>
        <Controller
          control={control}
          name="reps_completed"
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 8 }}>Completed:</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 4,
                  padding: 8,
                  width: 80,
                  backgroundColor: 'white'
                }}
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(text ? parseInt(text) : null)}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          )}
        />
      </View>

      {/* Prescribed vs Actual Load */}
      <View style={{ marginBottom: 8 }}>
        <Text style={{ marginBottom: 4 }}>
          Load: {exercise.prescribed_load}kg prescribed
        </Text>
        <Controller
          control={control}
          name="weight_used"
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 8 }}>Used:</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 4,
                  padding: 8,
                  width: 80,
                  backgroundColor: 'white'
                }}
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(text ? parseFloat(text) : null)}
                keyboardType="numeric"
                placeholder="0"
              />
              <Text style={{ marginLeft: 4 }}>kg</Text>
            </View>
          )}
        />
      </View>

      {/* Prescribed vs Actual RPE */}
      <View style={{ marginBottom: 8 }}>
        <Text style={{ marginBottom: 4 }}>
          RPE: {exercise.prescribed_rpe} prescribed
        </Text>
        <Controller
          control={control}
          name="rpe"
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 8 }}>Actual:</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 4,
                  padding: 8,
                  width: 80,
                  backgroundColor: 'white'
                }}
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(text ? parseInt(text) : null)}
                keyboardType="numeric"
                placeholder="1-10"
              />
            </View>
          )}
        />
      </View>

      {/* Stopwatch Component */}
      {exercise.rep_duration && exercise.rep_duration > 0 && (
        <Stopwatch
          duration={exercise.rep_duration}
          onComplete={() => {
            Alert.alert("Time's Up!", "Rest period completed!");
          }}
        />
      )}

      {/* Fatigue Level */}
      <View style={{ marginBottom: 8 }}>
        <Text style={{ marginBottom: 4 }}>Fatigue Level (1-10):</Text>
        <Controller
          control={control}
          name="fatigue_level"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
                padding: 8,
                width: 80,
                backgroundColor: 'white'
              }}
              value={value?.toString() || ''}
              onChangeText={(text) => onChange(text ? parseInt(text) : null)}
              keyboardType="numeric"
              placeholder="1-10"
            />
          )}
        />
      </View>

      {/* Failure Reached */}
      <View style={{ marginBottom: 8 }}>
        <Text style={{ marginBottom: 4 }}>Failure Reached (1-10):</Text>
        <Controller
          control={control}
          name="failure_reached"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
                padding: 8,
                width: 80,
                backgroundColor: 'white'
              }}
              value={value?.toString() || ''}
              onChangeText={(text) => onChange(text ? parseInt(text) : null)}
              keyboardType="numeric"
              placeholder="1-10"
            />
          )}
        />
      </View>

      {/* Notes */}
      {exercise.prescribed_notes > 0 && (
        <Text style={{ fontStyle: 'italic', marginBottom: 4 }}>Has prescribed notes</Text>
      )}
      <View style={{ marginBottom: 8 }}>
        <Text style={{ marginBottom: 4 }}>Notes:</Text>
        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
                padding: 8,
                backgroundColor: 'white',
                minHeight: 60
              }}
              value={value || ''}
              onChangeText={onChange}
              placeholder="Add your notes here..."
              multiline
              textAlignVertical="top"
            />
          )}
        />
      </View>

      {/* Submit Button */}
      {isDirty && (
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={{
            backgroundColor: '#007AFF',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 16
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Update Exercise</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
