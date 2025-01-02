import { ChaletBooking } from '../reservations/types';

export interface Customer {
  id: string;
  uniqueId: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  addresss: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  createdAt: string;
  updatedAt: string;
  bookings: ChaletBooking[];
}

export interface ApiResponse {
  message: string;
  customers: Customer[];
}
