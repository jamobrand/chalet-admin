export interface AddOn {
  id: string;
  uniqueId: string;
  name: string;
  description: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  message: string;
  addons: AddOn[];
}
