import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const createUser = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
  }
};

export const otpGenerate = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/otp-generate`, { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
  }
};
