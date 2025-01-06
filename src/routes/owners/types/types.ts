export interface Owner {
  id: string;
  email: string;
  isEmailVerified: boolean;
  name: string;
  photo: {
    id: string;
    image: string;
    name: string;
    isGravatar: boolean;
  };
  role: string;
  status: string;
}

export interface ApiResponse {
  message: string;
  owners: Owner[];
}
