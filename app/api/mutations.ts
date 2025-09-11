import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogExerciseData = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
    return useMutation({
    mutationFn: async (payload) => {
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['planned-exercises'] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
};
