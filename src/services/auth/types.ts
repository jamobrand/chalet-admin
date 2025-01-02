export interface LoginOutput {
  message: string;
  token: string;
  user: User;
}

export interface User {
  id:string;
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

export interface UserProfileResponse {
  message: string;
  user: User;
}