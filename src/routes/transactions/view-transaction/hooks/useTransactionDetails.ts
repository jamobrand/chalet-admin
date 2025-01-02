import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { ApiResponse,Transaction } from './types';

export const useTransactionDetails = (id?: string) => {
  return useQuery<Transaction>({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/transactions/${id}`);
      return response.data.transaction;
    },
    enabled: !!id,
  });
};