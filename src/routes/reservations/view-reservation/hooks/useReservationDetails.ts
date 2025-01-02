import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { Booking } from '../types';

export const useReservationDetails = (id?: string) => {
  return useQuery<Booking>({
    queryKey: ['reservation', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/v1/reservations/${id}`);
      return response.data.reservation;
    },
    enabled: !!id,
  });
};