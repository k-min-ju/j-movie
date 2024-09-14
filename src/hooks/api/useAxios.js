import { useCallback } from 'react';
import axios from 'axios';
import { axiosInstance } from '@/services';

export const useAxios = () => {
  const axiosGet = useCallback(async (url, config) => {
    try {
      const response = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Axios error: ${error.message}`);
      } else {
        throw new Error(`General error: ${error}`);
      }
    }
  }, []);
  return {
    axiosGet
  };
};
