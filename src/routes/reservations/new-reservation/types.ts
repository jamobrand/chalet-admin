import { z } from 'zod'

export interface AdminBookingFormData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber: string;
  };
  booking: {
    checkIn: Date;
    checkOut: Date;
    numberOfAdults: number;
    numberOfChildren: number;
  };
}

export const bookingFormSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email().optional(),
    phone: z.string().min(1, 'Phone number is required'),
    nationality: z.string().optional(),
    passportNumber: z.string().optional()
  }),
  booking: z.object({
    checkIn: z.date(),
    checkOut: z.date(),
    numberOfAdults: z.number().min(1, 'At least 1 adult is required'),
    numberOfChildren: z.number().min(0)
  })
})

export type BookingFormData = z.infer<typeof bookingFormSchema>