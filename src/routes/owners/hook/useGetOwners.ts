import { ApiResponse } from '../types/types';
import { usePrivateRequest } from '@/lib/network';
import { useApiGet } from '@/lib/hooks/use-api-get';
import { getOwners } from './get-owner';

// export const useGetOwners = () => {
//   return useQuery<Owner[], Error>({
//     queryKey: ['owners'],
//     queryFn: async () => {
//       const response = await axios.get<ApiResponse>(`${API_URL}/v1/owners/all-owners`);
//       return response.data.owners; // Extract the chalets array from the response
//     },
//   });
// };


export const useGetOwners = () => {
  const { privateRequest } = usePrivateRequest<ApiResponse>();

  // Use the useApiGet hook with the appropriate parameters
  const { data, isLoading, error, isError, refetch } = useApiGet<ApiResponse, Error>(
    ['owners'], // Query key to identify this query
    () => getOwners(privateRequest), // Fetch function that returns a promise
  );

  return { data, isLoading, error, isError, refetch };
};
