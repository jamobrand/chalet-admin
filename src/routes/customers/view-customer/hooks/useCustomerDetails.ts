import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { Customer } from '../../types';
import { ApiResponse } from '../types';

export const useCustomerDetails = (id?: string) => {
  return useQuery<Customer>({
    queryKey: ['customer', id],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/customers/${id}`);
      return response.data.customer;
    },
    enabled: !!id,
  });
};