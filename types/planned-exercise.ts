export interface PlannedExercise {
  planned_exercise_id: number;
  name: string;
  prescribed_reps: number;
  reps_completed: number | null;
  set_number: number;
  round_number: number;
  sequence_in_round: number;
  prescribed_notes: number;
  note: string | null;
  set_rest: number;
  rep_duration: number | null;
  prescribed_rpe: number;
  rpe: number | null;
  prescribed_load: number;
  weight_used: number | null;
  fatigue_level: number | null;
  failure_reached: number | null;
}

export interface ExerciseFormData {
  reps_completed: number | null;
  weight_used: number | null;
  rpe: number | null;
  fatigue_level: number | null;
  failure_reached: number | null;
  note: string | null;
}
