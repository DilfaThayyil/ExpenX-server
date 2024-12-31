import { createOtp, findOtpByEmail, deleteOtp } from '../repositories/otpRepository'
import UserRepository from '../repositories/userRepository'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
const userRepository = new UserRepository()
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth'; 

export const verifyOtp = async (otp: string, email: string, username: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/verifyOTP`, { otp, email, username, password });
  return response.data;
};

export const createUser = async (userData: { username: string; email: string; password: string }) => {
  const response = await axios.post(`${API_BASE_URL}/register`, userData);
  return response.data.message;
};


export const otpGenerate = async (email: string) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expirationTime = new Date(Date.now() + 5 * 60 * 1000); 
  await createOtp(email, otp, expirationTime)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASSWORD, 
    },
  })
  const mailOptions = {
    from: '"ExpenX" <no-reply@expenx.com>',
    to: email,
    subject: 'Your OTP for Registration',
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>. It is valid for <b>5 minutes</b>.</p>`,
  };
  await transporter.sendMail(mailOptions);
  return {message:'OTP send successfully'}
};



interface VerifyAndRegisterInput {
  otp: string;
  email: string;
  username: string;
  password: string;
}

export const verifyOtpAndRegisterUser = async ({
  otp,
  email,
  username,
  password,
}: VerifyAndRegisterInput) => {
  const otpRecord = await findOtpByEmail(email);
  if (!otpRecord) {
    throw new Error('Invalid or expired OTP');
  }
  if (otpRecord.otp !== otp) {
    throw new Error('Incorrect OTP');
  }
  if (otpRecord.expiresAt < new Date()) {
    throw new Error('OTP has expired');
  }
  await deleteOtp(email);
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email is already in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await userRepository.createUser({ username, email, password: hashedPassword });
  return 'User registered successfully';
};
