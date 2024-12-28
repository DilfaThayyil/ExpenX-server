import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/userRepository';

const userRepository = new UserRepository();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if(error instanceof Error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
        res.status(500).json({message:"An unknown error occurred"})
  }
};
