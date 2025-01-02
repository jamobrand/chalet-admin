import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { ApiResponse, ChaletBooking } from '../types';

export const useReservations = () => {
  return useQuery<ChaletBooking[], Error>({
    queryKey: ['reservations'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/reservations/all-reservations`);
      return response.data.reservations; // Extract the chalets array from the response
    },
  });
};
