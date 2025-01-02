import Cookies from 'js-cookie';
import { client } from './axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Define request options type that extends AxiosRequestConfig for flexibility
interface RequestOptions extends AxiosRequestConfig {
  url: string; // URL is mandatory
}

// Refactor: Don't call `useStore` in async, move it to the component level
export const usePrivateRequest = <T>() => {
  const privateRequest = async (options: RequestOptions): Promise<T> => {
    const token = Cookies.get('chalet-token'); // Directly get the token from cookies

    // Set the authorization header if the token exists
    if (token) {
      options.headers = {
        ...options.headers, // Ensure any existing headers are preserved
        Authorization: `${token}`,
      };
    }
    // Success handler with proper typing
    const onSuccess = (response: AxiosResponse<T>): T => {
      return response.data; // Adjust based on your API response structure
    };

    // Error handler with proper typing
    const onError = (error: AxiosError): Promise<never> => {
      return Promise.reject(error.response?.data || error.message);
    };

    // Execute the request and handle success/error with generics
    return client(options).then(onSuccess).catch(onError);
  };

  return { privateRequest };
};

export const publicRequest = async <T>(options: RequestOptions): Promise<T> => {
  // Success handler with proper typing
  const onSuccess = (response: AxiosResponse<T>): T => {
    return response.data; // No need to access 'data.data', as the API response is not nested
  };

  // Error handler with proper typing
  const onError = (error: AxiosError): Promise<never> => {
    return Promise.reject(error.response?.data || error.message);
  };

  // Execute the request and handle success/error with generics
  return client(options).then(onSuccess).catch(onError);
};
