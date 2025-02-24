import { IUserRepository } from '../../../repositories/Interface/IUserRepository';
import { IAuthUserService } from '../../Interface/user/IAuthuserService';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../utils/jwt';
import Otp from '../../../models/otpSchema';
import { sendOtpEmail } from '../../../utils/sendOtp';
import { validateEmail } from '../../validator';
// import { googleVerify } from '../../utils/googleOAuth';
import { injectable,inject } from 'tsyringe';
import redisClient from '../../../utils/redisClient';
import { NotFoundError,ValidationError,ExpiredError } from '../../../utils/errors';



@injectable()
export default class AuthUserService implements IAuthUserService {
  private userRepository: IUserRepository;

  constructor(@inject('IUserRepository') userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(username: string, email: string, password: string): Promise<void> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) throw new Error('Email is already in use')
    await redisClient.setEx(`email:${email}`, 3600, JSON.stringify({ username, email, password }))    
  }


  async generateOTP(email: string): Promise<void> {
    const user = await this.userRepository.findUserByEmail(email);
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
    console.log('resendOTP service...')
    console.log('diluuuuuuuuuuuuu')
    const otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
  console.log("otp in service : ",otp)
  console.log('dilllllffffaaaa')
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  
    await sendOtpEmail(email, otp);
  }
  

  async verifyOTP(email: string, otp: string): Promise<void> {
    const otpRecord = await Otp.findOne({ email });
    console.log("otp : ",otpRecord)
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
    await this.userRepository.createUser(userData);
  }
  

  async loginUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    console.log('loginUser : ',user)
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid credentials');
    console.log("isValidPassword : ",validPassword)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log("access : ",accessToken)
    console.log("refresh : ",refreshToken)
    user.accessToken = accessToken
    user.refreshToken = refreshToken
    return user
  }  


  async  setNewAccessToken(refreshToken:string):Promise<any> {
    try {
      console.log("setting new acessToken....")
      const decoded = verifyRefreshToken(refreshToken);
      console.log("decoded-service : ",decoded)
      const user = decoded
      console.log("user-service : ",user)
      if (!decoded || !user) {
        throw new Error("Invalid or expired refresh token");
      }
      const accessToken = generateAccessToken({ user });
      console.log("new accessToken ===>",accessToken)
      return {
        accessToken,
        message: "Access token set successfully from service ",
        success: true,
        user:user
      }
    } catch (error:any) {
      throw new Error("Error generating new access token: " + error.message);
    }
  } 


  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new Error('Email not found');
    console.log("user in forgotPass : ",user)
    const otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    console.log("otp : ",otp)
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
      throw new NotFoundError('No OTP record found for this email.');
    }
    if (otpRecord.otp !== otp) {
      throw new ValidationError('The OTP you entered is incorrect.');
    }
    if (otpRecord.expiresAt.getTime() < Date.now()) {
      throw new ExpiredError('The OTP has expired. Please request a new one.');
    }
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    console.log('Resetting password for email : ',email)
    const user = await this.userRepository.findUserByEmail(email);
    if(!user){
      console.error('User not found : ',email)
      throw new Error("User Not Found")
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Hashed password : ',hashedPassword)
    await this.userRepository.updateUser({ password: hashedPassword }, email);
  }

  async googleAuth(username:string,email: string,password: string,profilePic:string): Promise<any> {
    const userCredentials = {
      username,
      email,
      password,
      profilePic
    }
    console.log("usercredentials in services ; ",userCredentials)
    let existingUser
     existingUser = await this.userRepository.findUserByEmail(userCredentials?.email);
    if (!existingUser) {
      existingUser = await this.userRepository.createUser(userCredentials);
      console.log(existingUser,"userrrrrrrrrrrrr");
    }
    console.log("existingUser : ",existingUser)
    return existingUser;
  }
}