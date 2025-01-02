import { ChaletBooking } from "@/routes/reservations/types";

export interface ApiResponse {
    message: string;
    transaction: Transaction;
  }

  export interface Transaction {
      id: string;
      amount: string;
      transactionId: string;
      method:string;
      status:string;
      booking:ChaletBooking;
      createdAt: string;
      updatedAt: string;
  }
  