import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { AddOn, ApiResponse } from '../types';

export const useAddons = () => {
  return useQuery<AddOn[], Error>({
    queryKey: ['addons'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/addons/all-addons`);
      return response.data.addons; // Extract the chalets array from the response
    },
  });
};
