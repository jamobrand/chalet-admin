export interface Coordinates {
    lat: number;
    lng: number;
  }
  
  export  interface Chalet {
    id: string;
    chaletUniqueId: string;
    name: string;
    type: string;
    description: string;
    basePrice: string;
    isEnsuite: boolean;
    roomCount: number;
    isUnderMaintenance: boolean;
    reasonForMaintenance: string;
    locationName: string;
    address: string;
    coordinates: Coordinates;
    createdAt: string;
    updatedAt: string;
  }
  
  export  interface Customer {
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
  }
  
  export  interface AddOn {
    id: string;
    uniqueId: string;
    name: string;
    description: string;
    price: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BookingAddOn {
    id: string;
    uniqueId: string;
    bookingId: string;
    addOnId: string;
    createdAt: string;
    updatedAt: string;
    addOn: AddOn;
  }
  
  export  interface BookingDate {
    id: string;
    date: string;
    bookingId: string;
  }
  
  export  interface Payment {
    id: string;
    uniqueId: string;
    bookingId: string;
    amount: string;
    // status: 'PENDING' | 'FULLY_PAID' | 'PARTIALLY_PAID' | 'FAILED';
    status:string;
    // method: 'CREDIT_CARD' | 'MPESA' | 'BANK_TRANSFER';
    method:string;
    transactionId: string;
    receiptNumber: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BookingCount {
    payments: number;
    bookingDates: number;
    bookingAddOn: number;
  }
  
  export interface Booking {
    id: string;
    chaletId: string;
    checkIn: string;
    checkOut: string;
    numberOfAdults: number;
    numberOfChildren: number;
    totalGuests: number;
    totalCost: string;
    customerId: string;
    // status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'COMPLETED';
    status: string;
    createdAt: string;
    updatedAt: string;
    chalet: Chalet;
    bookingDates: BookingDate[];
    bookingAddOn: BookingAddOn[];
    customer: Customer;
    payments: Payment[];
    _count: BookingCount;
  }
  