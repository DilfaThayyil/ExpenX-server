import axios from 'axios';
import {findOtpByEmail,deleteOtp} from '../repositories/otpRepository'
import UserRepository from '../repositories/userRepository';
import { generateJwt } from '../utils/jwt';
import { Types } from 'mongoose';
const API_BASE_URL = 'http://localhost:3000/api/auth';
const userRepository = new UserRepository()



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
  const otpRecord = await findOtpByEmail(email)
  if(!otpRecord){
    throw new Error('invalid otp')
  }
  
  await deleteOtp(email)
  const user = await userRepository.findUserByEmail(email)
  if(!user){
    throw new Error('user not found')
  }
  const tokenPayload = {
    id:(user._id as Types.ObjectId).toString(),
    email:user.email
  }
  return generateJwt(tokenPayload)
}