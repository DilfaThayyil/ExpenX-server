import { IUserRepository } from '../../repositories/Interface/IUserRepository';
import { IUserService } from '../Interface/IUserService';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import Otp from '../../models/otpSchema';
import { sendOtpEmail } from '../../utils/sendOtp';
import { validateEmail } from '../../services/validator';
// import { googleVerify } from '../../utils/googleOAuth';
import { injectable,inject } from 'tsyringe';
import redisClient from '../../utils/redisClient';
import { JwtPayload } from 'jsonwebtoken';
import { NotFoundError,ValidationError,ExpiredError } from '../../utils/errors';



@injectable()
export default class UserService implements IUserService {
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
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    const user = await this.userRepository.findUserByRefreshToken(refreshToken);
    if (!user) throw new Error('User not found');
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken: newRefreshToken };
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

  async googleAuth(username:string,email: string,profilePic:string): Promise<any> {
    const userCredentials = {
      username,
      email,
      profilePic
    }
    console.log("usercredentials in services ; ",userCredentials)
    // const googleUser = await googleVerify(userCredentials);
    // if(!googleUser?.email){
    //     throw new Error('Invalid Google credentials');
    // }
    let existingUser
     existingUser = await this.userRepository.findUserByEmail(userCredentials?.email);
    if (!existingUser) {
      console.log('yes')
      existingUser = await this.userRepository.createUser(userCredentials);
      console.log(existingUser,"userrrrrrrrrrrrr");
      
      if(existingUser){
        console.log("dilu difaa");
        
      }else{
        console.log("dfghnjm");
        
      }
    }
    console.log("existingUser : ",existingUser)
    return existingUser;
  }
}