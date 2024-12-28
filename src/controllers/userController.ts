import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/userRepository';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import OtpModel from '../models/otpSchema'; 





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




export const sendOtp = async (req: Request, res: Response):Promise<void> => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expirationTime = new Date(Date.now() + 60 * 1000); // 1 minute
    await OtpModel.create({ email, otp, expiresAt: expirationTime });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASSWORD, 
      },
    });

    const mailOptions = {
      from: '"ExpenX" <no-reply@expenx.com>',
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for <b>5 minutes</b>.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};
