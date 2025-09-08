import { PlannedExercise } from "@/types/planned-exercise";
import { useState } from "react";
import { Text, View } from "react-native";
import Stopwatch from "../stopwatch/stopwatch";

interface RestCardProps {
  previousExercise: PlannedExercise;
  nextExercise?: PlannedExercise | null;
  onRestComplete?: () => void;
}

export default function RestCard({ previousExercise, nextExercise, onRestComplete }: RestCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRestComplete = () => {
    setIsCompleted(true);
    if (onRestComplete) {
      onRestComplete();
    }
  };

  return (
    <View style={{
      padding: 16,
      backgroundColor: '#e8f4fd',
      borderRadius: 12,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#007AFF'
    }}>
      {/* Rest Header */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#007AFF',
          marginBottom: 4
        }}>
          Rest Period
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#666',
          textAlign: 'center'
        }}>
          After {previousExercise.name} (Set {previousExercise.set_number})
        </Text>
      </View>

      {/* Rest Duration Info */}
      <View style={{
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: 4
        }}>
          Prescribed Rest: {previousExercise.set_rest}s
        </Text>
        {nextExercise && (
          <Text style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center'
          }}>
            Next: {nextExercise.name} (Set {nextExercise.set_number})
          </Text>
        )}
      </View>



      {/* Timer Component */}
      {previousExercise.set_rest > 0 && (
        <Stopwatch
          duration={previousExercise.set_rest * 10}
          onComplete={handleRestComplete}
        />
      )}

      {/* Rest Complete Status */}
      {isCompleted && (
        <View style={{
          backgroundColor: '#d4edda',
          borderColor: '#c3e6cb',
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginTop: 16,
          alignItems: 'center'
        }}>
          <Text style={{
            color: '#155724',
            fontWeight: 'bold',
            fontSize: 16
          }}>
            ✓ Rest Complete!
          </Text>
          <Text style={{
            color: '#155724',
            fontSize: 14,
            marginTop: 4
          }}>
            Ready for the next exercise
          </Text>
        </View>
      )}

      {/* Rest Tips */}
      <View style={{
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginTop: 16
      }}>
        <Text style={{
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          💡 Use this time to hydrate, breathe deeply, and prepare for your next set
        </Text>
      </View>
    </View>
  );
}
