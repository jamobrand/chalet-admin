import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { ApiResponse, Customer } from '../types';

export const useCustomers = () => {
  return useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/customers/all-customers`);
      return response.data.customers; // Extract the chalets array from the response
    },
  });
};
