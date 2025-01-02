import { AxiosRequestConfig } from 'axios';
import { UserProfileResponse } from '../types';

// Define request options type that extends AxiosRequestConfig for flexibility
interface RequestOptions extends AxiosRequestConfig {
  url: string; // URL is mandatory
  method: string; //
}

export const meUser = async (
  privateRequest: (options: RequestOptions) => Promise<UserProfileResponse>,
): Promise<UserProfileResponse> => {
  const response = await privateRequest({
    url: '/v1/auth/me',
    method: 'get',
  });
  return response;
};
