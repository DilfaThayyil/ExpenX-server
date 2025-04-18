import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../utils/jwt';
import Otp from '../../../models/otpSchema';
import { sendOtpEmail } from '../../../utils/email/sendOtp';
// import { googleVerify } from '../../utils/googleOAuth';
import { injectable,inject } from 'tsyringe';
import redisClient from '../../../utils/redisClient';
import { IAuthAdvisorService } from '../../Interface/advisor/IAuthAdvisorService';
import { IAdvisorRepository } from '../../../repositories/Interface/IAdvisorRepository';
import { NotFoundError, ValidationError, ExpiredError } from '../../../utils/errors';



@injectable()
export default class AuthAdvisorService implements IAuthAdvisorService {
  private _advisorRepository: IAdvisorRepository;

  constructor(@inject('IAdvisorRepository') advisorRepository: IAdvisorRepository) {
    this._advisorRepository = advisorRepository;
  }

  async register(username: string, email: string, password: string): Promise<void> {
    const existingUser = await this._advisorRepository.findUserByEmail(email);
    if (existingUser) throw new Error('Email is already in use')
    await redisClient.setEx(`email:${email}`, 3600, JSON.stringify({ username, email, password }))    
  }
  

  async generateOTP(email: string): Promise<void> {
    const user = await this._advisorRepository.findUserByEmail(email);
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


  async resendOTP(email:string):Promise<void>{
    const otp = (Math.floor(Math.random()*10000)).toString().padStart(4,'0')
    const expiresAt = new Date(Date.now()+1*60*1000)
    await Otp.findOneAndUpdate(
      {email},
      {otp,expiresAt},
      {upsert: true, new:true, setDefaultsOnInsert: true}
    )
    await sendOtpEmail(email,otp)
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
    await this._advisorRepository.createUser(userData);
  }
  

  async loginUser(email: string, password: string): Promise<any> {
    const user = await this._advisorRepository.findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid credentials');
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.accessToken = accessToken
    user.refreshToken = refreshToken
    return user
  }

  async setNewAccessToken(refreshToken: string): Promise<any> {
    try {
      const isBlacklisted = await redisClient.get(`bl:${refreshToken}`);
      if (isBlacklisted) throw new Error("Refresh token expired or blacklisted");
      const decoded = verifyRefreshToken(refreshToken);
      const accessToken = generateAccessToken(decoded);
      return {
        accessToken,
        message: "Access token set successfully from service ",
        success: true,
        user: decoded
      }
    } catch (error: any) {
      throw new Error("Error generating new access token: " + error.message);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this._advisorRepository.findUserByEmail(email);
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
    if(!otpRecord){
      throw new Error("No OTP record found for this _email")
     }
     if(otpRecord.otp!==otp){
      throw new Error("The OTP you entered is incorrect")
     }
     if(otpRecord.expiresAt.getTime()<Date.now()){
      throw new Error("The OTP has expired. Please request a new one")
     }
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this._advisorRepository.findUserByEmail(email);
    if(!user){
      console.error('User not found : ',email)
      throw new Error("User Not Found")
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._advisorRepository.updateUser({ password: hashedPassword }, email);
  }

  async googleAuth(username:string,email: string,password:string,profilePic:string): Promise<any> {
    const userCredentials = {
      username,
      email,
      password,
      profilePic
    }
    let existingUser
     existingUser = await this._advisorRepository.findUserByEmail(userCredentials?.email);
    if (!existingUser) {
      existingUser = await this._advisorRepository.createUser(userCredentials);
    }
    const user = {
      id:existingUser._id,
      name:existingUser.name,
      admin:existingUser.isAdmin,
      role:existingUser.role
    }
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    return {existingUser,accessToken,refreshToken};
  }
}