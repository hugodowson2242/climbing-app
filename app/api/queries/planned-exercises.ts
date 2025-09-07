import { PlannedExercise } from '@/types/planned-exercise';
import { useQuery } from '@tanstack/react-query';

interface PlannedExercisesResponse {
  items: PlannedExercise[];
  hasMore: boolean;
  limit: number;
  offset: number;
  count: number;
  links: {
    rel: string;
    href: string;
  }[];
}

interface PlannedExercisesParams {
  athleteId: number;
  plannedTrainingSessionId?: number;
}

const fetchPlannedExercises = async (params: PlannedExercisesParams): Promise<PlannedExercisesResponse> => {
  const url = new URL(
    'https://g32c06fca666406-jamesgoodeycpl.adb.uk-london-1.oraclecloudapps.com/ords/jamescpl/planned_entities/planned_exercises'
  );

  // Add query parameters
  url.searchParams.append('ATHLETE_ID', params.athleteId.toString());
  if (params.plannedTrainingSessionId) {
    url.searchParams.append('PLANNED_TRAINING_SESSION_ID', params.plannedTrainingSessionId.toString());
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch planned exercises');
  }

  return response.json();
};

export function usePlannedExercises(params: PlannedExercisesParams) {
  return useQuery({
    queryKey: ['planned-exercises', params],
    queryFn: () => fetchPlannedExercises(params),
    enabled: !!params.athleteId, // Only run if athleteId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Convenience hook for backward compatibility
export function usePlannedExercisesByAthlete(athleteId: number) {
  return usePlannedExercises({ athleteId });
}

// Convenience hook for fetching exercises in a specific training session
export function usePlannedExercisesBySession(athleteId: number, plannedTrainingSessionId: number) {
  return usePlannedExercises({ athleteId, plannedTrainingSessionId });
}
