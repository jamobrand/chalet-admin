import { ChaletBooking } from "../reservations/types";

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

export interface ApiResponse {
    message: string;
    transactions: Transaction[];
  }