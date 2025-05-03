import { IUserRepository } from '../../../repositories/Interface/IUserRepository';
import { IAuthUserService } from '../../Interface/user/IAuthuserService';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../utils/jwt';
import Otp from '../../../models/otpSchema';
import { sendOtpEmail } from '../../../utils/email/sendOtp';
// import { googleVerify } from '../../utils/googleOAuth';
import { injectable, inject } from 'tsyringe';
import redisClient from '../../../utils/redisClient';
import { NotFoundError, ValidationError, ExpiredError } from '../../../utils/errors';



@injectable()
export default class AuthUserService implements IAuthUserService {
  private _userRepository: IUserRepository;

  constructor(@inject('IUserRepository') userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async register(username: string, email: string, password: string): Promise<void> {
    const existingUser = await this._userRepository.findUserByEmail(email);
    if (existingUser) throw new Error('Email is already in use')
    await redisClient.setEx(`email:${email}`, 3600, JSON.stringify({ username, email, password }))
  }


  async generateOTP(email: string): Promise<void> {
    const user = await this._userRepository.findUserByEmail(email);
    if (user) throw new Error('Email already verified');
    const otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await sendOtpEmail(email, otp);
  }


  async resendOTP(email: string): Promise<void> {
    const otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await sendOtpEmail(email, otp);
  }


  async verifyOTP(email: string, otp: string): Promise<void> {
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      throw new NotFoundError('OTP not found.');
    }
    if (otpRecord.otp !== otp) {
      throw new ValidationError('Invalid OTP.');
    }
    if (otpRecord.expiresAt.getTime() < Date.now()) {
      throw new ExpiredError('OTP expired.');
    }
    const userDataString = await redisClient.get(`email:${email}`);
    if (!userDataString) {
      throw new ValidationError('User is not in the session.');
    }
    const userData = JSON.parse(userDataString) as { username: string; email: string; password: string };
    userData.password = await bcrypt.hash(userData.password, 10);
    await this._userRepository.createUser(userData);
  }


  async loginUser(email: string, password: string): Promise<any> {
    const userData = await this._userRepository.findUserByEmail(email);
    if (!userData) throw new Error('Invalid credentials');
    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) throw new Error('Invalid credentials');
    const user = {
      id: userData._id,
      email: userData.email,
      admin: userData.isAdmin,
      role: userData.role,
    };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { userData, accessToken, refreshToken }
  }


  async setNewAccessToken(refreshToken: string): Promise<any> {
    try {
    console.log("🔄 [Service] setNewAccessToken called with token:", refreshToken);
      const isBlacklisted = await redisClient.get(`bl:${refreshToken}`);
    console.log("🧾 [Redis] Is refresh token blacklisted?", isBlacklisted);

      if (isBlacklisted) {
      console.warn("🚫 [Service] Refresh token is blacklisted or expired.");
	throw new Error("Refresh token expired or blacklisted")
	}
      const decoded = verifyRefreshToken(refreshToken);
    console.log("🔓 [JWT] Refresh token verified. Decoded payload:", decoded);

      const accessToken = generateAccessToken(decoded);
    console.log("🔐 [JWT] New access token generated:", accessToken);

      return {
        accessToken,
        message: "Access token set successfully from service ",
        success: true,
        user: decoded
      }
    } catch (error: any) {
    console.error("❌ [Service] Error in setNewAccessToken:", error.message);
      throw new Error("Error generating new access token: " + error.message);
    }
  }


  async forgotPassword(email: string): Promise<void> {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) throw new Error('Email not found');
    const otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOtpEmail(email, otp);
  }


  async verifyForgotPasswordOtp(email: string, otp: string): Promise<void> {
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      throw new NotFoundError('No OTP record found for this _email.');
    }
    if (otpRecord.otp !== otp) {
      throw new ValidationError('The OTP you entered is incorrect.');
    }
    if (otpRecord.expiresAt.getTime() < Date.now()) {
      throw new ExpiredError('The OTP has expired. Please request a new one.');
    }
  }


  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) {
      console.error('User not found : ', email)
      throw new Error("User Not Found")
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._userRepository.updateUser({ password: hashedPassword }, email);
  }


  async googleAuth(username: string, email: string, password: string, profilePic: string): Promise<any> {
    const userCredentials = {
      username,
      email,
      password,
      profilePic
    }
    let existingUser
    existingUser = await this._userRepository.findUserByEmail(userCredentials?.email);
    if (!existingUser) {
      existingUser = await this._userRepository.createUser(userCredentials);
    }
    const user = {
      id: existingUser._id,
      name: existingUser.name,
      admin: existingUser.isAdmin,
      role: existingUser.role
    }
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    return { existingUser, accessToken, refreshToken };
  }
}
