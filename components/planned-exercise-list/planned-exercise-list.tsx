import { usePlannedExercisesBySession } from "@/app/api/queries/planned-exercises";
import { ExerciseFormData } from "@/types/planned-exercise";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import ExerciseCard from "./exercise-card";
import RestCard from "./rest-card";

function PlannedExerciseList() {
  // Using session ID 2 and athlete ID 341 as in your curl example
  const { data, isLoading, error } = usePlannedExercisesBySession(341, 2);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    const totalItems = getTotalItems();
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleExerciseUpdate = (updatedData: ExerciseFormData) => {
    console.log('Exercise updated:', updatedData);
    // Here you would typically send the data to your API
    // For now, we'll just log it
  };

  // Helper functions for exercise/rest logic
  const getTotalItems = () => {
    if (!data?.items) return 0;
    // Each exercise except the last one has a rest period after it
    // So if we have 3 exercises: Ex1, Rest1, Ex2, Rest2, Ex3 = 5 total items
    return data.items.length + Math.max(0, data.items.length - 1);
  };

  const isRestPeriod = (index: number) => {
    // Rest periods are at odd indices (1, 3, 5, etc.)
    return index % 2 === 1;
  };

  const getExerciseIndex = (index: number) => {
    // Exercise indices: 0->0, 1->0 (rest after 0), 2->1, 3->1 (rest after 1), etc.
    return Math.floor(index / 2);
  };

  const getCurrentExercise = () => {
    if (!data?.items) return null;
    const exerciseIndex = getExerciseIndex(currentIndex);
    return data.items[exerciseIndex] || null;
  };

  const getPreviousExercise = () => {
    if (!data?.items) return null;
    if (isRestPeriod(currentIndex)) {
      // For rest periods, we want the exercise that just completed
      const exerciseIndex = getExerciseIndex(currentIndex);
      return data.items[exerciseIndex] || null;
    }
    // For exercise periods, get the actual previous exercise
    const exerciseIndex = getExerciseIndex(currentIndex);
    return data.items[exerciseIndex - 1] || null;
  };

  const getNextExercise = () => {
    if (!data?.items) return null;
    const exerciseIndex = getExerciseIndex(currentIndex);
    return data.items[exerciseIndex + 1] || null;
  };

  const handleRestComplete = () => {
    // Automatically move to next exercise when rest is complete
    goToNext();
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading planned exercises...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading exercises: {error.message}</Text>
      </View>
    );
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No planned exercises found</Text>
      </View>
    );
  }

  // Reset currentIndex if it's out of bounds
  if (currentIndex >= getTotalItems()) {
    setCurrentIndex(0);
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Carousel Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity
          onPress={goToPrevious}
          disabled={currentIndex === 0}
          style={{
            backgroundColor: currentIndex === 0 ? '#ccc' : '#007AFF',
            padding: 12,
            borderRadius: 8,
            minWidth: 80,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Previous</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          {currentIndex + 1} of {getTotalItems()}
        </Text>

        <TouchableOpacity
          onPress={goToNext}
          disabled={currentIndex === getTotalItems() - 1}
          style={{
            backgroundColor: currentIndex === getTotalItems() - 1 ? '#ccc' : '#007AFF',
            padding: 12,
            borderRadius: 8,
            minWidth: 80,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional rendering of Exercise or Rest Card */}
      {(() => {
        if (isRestPeriod(currentIndex)) {
          const previousExercise = getPreviousExercise();
          const nextExercise = getNextExercise();
          // Only show rest if there's a previous exercise and it's not the last exercise
          const exerciseIndex = getExerciseIndex(currentIndex);
          const isLastExercise = data?.items && exerciseIndex >= data.items.length - 1;

          return previousExercise && !isLastExercise ? (
            <RestCard
              previousExercise={previousExercise}
              nextExercise={nextExercise}
              onRestComplete={handleRestComplete}
            />
          ) : null;
        } else {
          const currentExercise = getCurrentExercise();
          return currentExercise ? (
            <ExerciseCard
              exercise={currentExercise}
              onUpdate={handleExerciseUpdate}
            />
          ) : null;
        }
      })()}
    </View>
  );
}

export default function Index() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PlannedExerciseList />
    </View>
  );
}
