import axios from 'axios';
import {findOtpByEmail,deleteOtp} from '../repositories/otpRepository'
import UserRepository from '../repositories/userRepository';




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


export const verifyOtp = async(email:string,otp:string)=>{
  const otpRecord = findOtpByEmail(email)
  if(!otpRecord){
    throw new Error('invalid otp')
  }
  if(otpRecord.otp!==otp){
    return null
  }
  if(otpRecord.expiresAt < new Date()){
    return null
  }
  await deleteOtp(email)
  const user = await UserRepository.findUserByEmail({email})
  if(!user){
    throw new Error('user not found')
  }
  return generateJwt({userId:user.id,email:user.email})
}