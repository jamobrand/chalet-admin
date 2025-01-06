import { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types/types';

interface RequestOptions extends AxiosRequestConfig {
  url: string; // URL is mandatory
  method: string; //
}

export const getOwners = async (
  privateRequest: (options: RequestOptions) => Promise<ApiResponse>,
): Promise<ApiResponse> => {
  const response = await privateRequest({
    url: '/v1/owners/all-owners',
    method: 'get',
  });
  return response;
};