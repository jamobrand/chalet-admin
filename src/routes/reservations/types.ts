
export interface ApiResponse {
  message: string;
  reservations: ChaletBooking[];
}

export interface ChaletBooking {
  id: string;
  chaletId: string;
  checkIn: string; // ISO Date String
  checkOut: string; // ISO Date String
  numberOfAdults: number;
  numberOfChildren: number;
  totalGuests: number;
  totalCost: string; // Consider using number if calculations are needed
  customerId: string;
  // status: "CONFIRMED" | "CANCELLED" | "PENDING"; // Enum of possible statuses
  status:string;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  customer: Customer;
  chalet: Chalet;
  bookingDates: BookingDate[];
  payments: Payment[];
  _count: Count;
}

export interface Customer {
  id: string;
  uniqueId: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  addresss: string; // Note the typo in address if intentional
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Chalet {
  id: string;
  chaletUniqueId: string;
  name: string;
  type: string;
  description: string;
  basePrice: string; // Consider using number if calculations are needed
  isEnsuite: boolean;
  roomCount: number;
  isUnderMaintenance: boolean;
  reasonForMaintenance: string;
  locationName: string;
  address: string;
  coordinates: Coordinates;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BookingDate {
  id: string;
  date: string; // ISO Date String
  bookingId: string;
}

export interface Payment {
  id: string;
  uniqueId: string;
  bookingId: string;
  amount: string; // Consider using number if calculations are needed
  // status: "FULLY_PAID" | "PARTIALLY_PAID" | "UNPAID"; // Enum of possible statuses
  status:string;
  // method: "CREDIT_CARD" | "BANK_TRANSFER" | "PAYPAL" | "CASH"; // Enum of payment methods
  method:string;
  transactionId: string;
  receiptNumber: string | null;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Count {
  payments: number;
  bookingDates: number;
}
