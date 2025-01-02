import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { ApiResponse, Transaction } from '../types';

export const useTransactions = () => {
  return useQuery<Transaction[], Error>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/transactions/all-transactions`)
      return response.data.transactions; // Extract the chalets array from the response
    },
  });
};
