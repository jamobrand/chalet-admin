import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { ApiResponse, Rule } from '../types';

export const useRules = () => {
  return useQuery<Rule[], Error>({
    queryKey: ['rules'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/rules/all-rules`);
      return response.data.rules; // Extract the chalets array from the response
    },
  });
};
