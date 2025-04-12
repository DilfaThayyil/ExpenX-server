import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../utils/jwt';
import Otp from '../../../models/otpSchema';
import { sendOtpEmail } from '../../../utils/sendOtp';
// import { googleVerify } from '../../utils/googleOAuth';
import { injectable,inject } from 'tsyringe';
import redisClient from '../../../utils/redisClient';
import { IAuthAdvisorService } from '../../Interface/advisor/IAuthAdvisorService';
import { IAdvisorRepository } from '../../../repositories/Interface/IAdvisorRepository';
import { NotFoundError, ValidationError, ExpiredError } from '../../../utils/errors';



@injectable()
export default class AuthAdvisorService implements IAuthAdvisorService {
  private advisorRepository: IAdvisorRepository;

  constructor(@inject('IAdvisorRepository') advisorRepository: IAdvisorRepository) {
    this.advisorRepository = advisorRepository;
  }

  async register(username: string, email: string, password: string): Promise<void> {
    console.log("  register-service -advisor ----------fksdj83457")
    const existingUser = await this.advisorRepository.findUserByEmail(email);
    console.log("existing user : ",existingUser)
    if (existingUser) throw new Error('Email is already in use')
      console.log("^^^ next is redisclient ^^^^^")
    await redisClient.setEx(`email:${email}`, 3600, JSON.stringify({ username, email, password }))    
  }
  

  async generateOTP(email: string): Promise<void> {
    console.log("generte-otp-advisor : email: ",email)
    const user = await this.advisorRepository.findUserByEmail(email);
    console.log("user ---> ",user)
    if (user) throw new Error('Email already verified');

    const otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
    console.log("otp ldsfksd  : ",otp)
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
    console.log("verfiying otp-advisor-email : ",otp ," , ",email)
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
    await this.advisorRepository.createUser(userData);
  }
  

  async loginUser(email: string, password: string): Promise<any> {
    const user = await this.advisorRepository.findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    console.log('loginUser : ',user)
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid credentials');
    console.log("validPassword : ",validPassword)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log("access,refresh : ",accessToken,"  &&  ",refreshToken)
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
    const user = await this.advisorRepository.findUserByEmail(email);
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
    if(!otpRecord){
      throw new Error("No OTP record found for this email")
     }
     if(otpRecord.otp!==otp){
      throw new Error("The OTP you entered is incorrect")
     }
     if(otpRecord.expiresAt.getTime()<Date.now()){
      throw new Error("The OTP has expired. Please request a new one")
     }
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    console.log('Resetting password for email : ',email)
    const user = await this.advisorRepository.findUserByEmail(email);
    if(!user){
      console.error('User not found : ',email)
      throw new Error("User Not Found")
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Hashed password : ',hashedPassword)
    await this.advisorRepository.updateUser({ password: hashedPassword }, email);
  }

  async googleAuth(username:string,email: string,password:string,profilePic:string): Promise<any> {
    const userCredentials = {
      username,
      email,
      password,
      profilePic
    }
    let existingUser
     existingUser = await this.advisorRepository.findUserByEmail(userCredentials?.email);
    if (!existingUser) {
      existingUser = await this.advisorRepository.createUser(userCredentials);
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