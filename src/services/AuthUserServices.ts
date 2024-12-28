import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/auth';

export const createUser = async (data: {username:string, email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, data);
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
    const response = await axios.post(`${API_BASE_URL}/sendOtp`, { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
  }
};
