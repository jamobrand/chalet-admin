import { useMutation, UseMutationOptions, QueryKey, useQueryClient } from '@tanstack/react-query';

export const useApiSend = <TData, TError, TVariables>(
  fn: (variables: TVariables) => Promise<TData>, // Mutation function (e.g., POST or PUT)
  success?: (data: TData) => void, // Optional success callback
  error?: (error: TError) => void, // Optional error callback
  invalidateKey?: QueryKey[], // Keys to invalidate on success
  options?: UseMutationOptions<TData, TError, TVariables>, // Mutation options
) => {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn: fn,
    onSuccess: (data) => {
      if (invalidateKey) {
        invalidateKey.forEach((key) => {
          // Fix: Invalidate each QueryKey properly
          queryClient.invalidateQueries({ queryKey: key }); // Ensure it's treated as a single queryKey
        });
      }
      if (success) success(data);
    },
    onError: error,
    retry: 2, // Default retry count for mutations
    ...options,
  });
};
