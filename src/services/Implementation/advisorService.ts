import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import Otp from '../../models/otpSchema';
import { sendOtpEmail } from '../../utils/sendOtp';
import { validateEmail } from '../../services/validator';
// import { googleVerify } from '../../utils/googleOAuth';
import { injectable,inject } from 'tsyringe';
import redisClient from '../../utils/redisClient';
import { JwtPayload } from 'jsonwebtoken';
import { IAdvisorService } from '../Interface/IAdvisorService';
import { IAdvisorRepository } from '../../repositories/Interface/IAdvisorRepository';



@injectable()
export default class AdvisorService implements IAdvisorService {
  private advisorRepository: IAdvisorRepository;

  constructor(@inject('IAdvisorRepository') advisorRepository: IAdvisorRepository) {
    this.advisorRepository = advisorRepository;
  }

  async register(username: string, email: string, password: string): Promise<void> {
    const existingUser = await this.advisorRepository.findUserByEmail(email);
    if (existingUser) throw new Error('Email is already in use')
    await redisClient.setEx(`email:${email}`, 3600, JSON.stringify({ username, email, password }))    
  }
  

  async generateOTP(email: string): Promise<void> {
    const user = await this.advisorRepository.findUserByEmail(email);
    if (user) throw new Error('Email already verified');

    const otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

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
    if (!otpRecord) throw new Error('OTP not found');

    if (otpRecord.otp !== otp) throw new Error('Invalid OTP');
    if (new Date() > otpRecord.expiresAt) throw new Error('OTP expired');
    const userDataString = await redisClient.get(`email:${email}`)
    console.log("after taking the userdata from redis....",userDataString)
    if(!userDataString) throw new Error('user is not in the session')
    const userData = JSON.parse(userDataString) as {username:string,email:string,password:string}
    console.log("userData : ",userData)
    userData.password = await bcrypt.hash(userData.password, 10);
    const uusser = await this.advisorRepository.createUser(userData);
    console.log(uusser,"moiduuuuuu")
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
    console.log("access,refresh : ",accessToken,refreshToken)
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    const user = await this.advisorRepository.findUserByRefreshToken(refreshToken);
    if (!user) throw new Error('User not found');
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken: newRefreshToken };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.advisorRepository.findUserByEmail(email);
    if (!user) throw new Error('Email not found');
    console.log("user in forgotPass : ",user)
    const otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    console.log("otp : ",otp)
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOtpEmail(email, otp);
  }

  async verifyForgotPasswordOtp(email: string, otp: string): Promise<any> {
    const otpRecord = await Otp.findOne({ email });
    if(!otpRecord){
      throw new Error("User Not Found")
     }
     if(otpRecord.otp!==otp){
      throw new Error("incorrect otp")
     }
     if(otpRecord.expiresAt.getTime()<Date.now()){
      throw new Error("otp has expired")
     }
     return { success: true, message: 'OTP verified successfully' }
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
     existingUser = await this.advisorRepository.findUserByEmail(userCredentials?.email);
    if (!existingUser) {
      console.log('moidu')
      existingUser = await this.advisorRepository.createUser(userCredentials);
      console.log(existingUser,"userrrrrrrrrrrrr");
      
      if(existingUser){
        console.log("moidd difaa");
        
      }else{
        console.log("dfghnjm");
        
      }
    }
    console.log("existingUser : ",existingUser)
    return existingUser;
  }
}