import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserRepository from '../../repositories/userRepository';
import { otpGenerate, verifyOtpAndRegisterUser } from '../../services/AuthUserServices';

const userRepository = new UserRepository();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.createUser({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: 'Unknown error occurred' });
    }
  }
};

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const response = await otpGenerate(email);
    res.status(200).json({ message: response });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    } else {
      res.status(500).json({ message: 'Failed to send OTP', error: 'Unknown error occurred' });
    }
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp, email, username, password } = req.body;

    const response = await verifyOtpAndRegisterUser({ otp, email, username, password });
    res.status(200).json({ message: response });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Unknown error occurred' });
    }
  }
};
