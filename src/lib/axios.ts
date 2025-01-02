
import { API_URL } from '@/config';
import axios from 'axios';

export const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

client.defaults.headers.common['Content-Type'] = 'application/json';
