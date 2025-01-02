import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { ApiResponse, Chalet } from '../types/types';

export const useChalets = () => {
  return useQuery<Chalet[], Error>({
    queryKey: ['chalets'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/chalets/all-chalets`);
      return response.data.chalets; // Extract the chalets array from the response
    },
  });
};
