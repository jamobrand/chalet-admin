import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';

export const useApiGet = <TData, TError>(
  key: QueryKey, // Query key for identifying cached queries
  fn: () => Promise<TData>, // The fetch function, typed with the expected response data
  options?: UseQueryOptions<TData, TError>, // Optional react-query options with type safety
) => {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: fn,
    ...options,
  });
};
