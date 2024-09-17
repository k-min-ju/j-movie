import axios from 'axios';
import { KMDB_URL } from '@/configs/constants';

export const createAxiosInstance = baseURL =>
  axios.create({
    baseURL,
    timeout: 15000
  });

export const axiosInstance = createAxiosInstance(KMDB_URL);
