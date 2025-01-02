import { publicRequest } from '@/lib/network';
import { User } from '../types';

export interface LoginInput {
  email?: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const loginUser = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await publicRequest<LoginResponse>({
    url: '/v1/auth/login',
    method: 'post',
    data,
  });
  return response;
};
