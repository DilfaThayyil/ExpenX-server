import  { Request, Response } from 'express';
import UserRepository from '../../repositories/userRepository';
import RegisterUser from '../../services/userServices'
import Otp from '../../models/otpSchema';
import { sendOtpEmail } from '../../utils/sendOtp';
import redisClient from '../../utils/redisClient';
import { HttpStatusCode } from '../../utils/httpStatusCode';
import UserService from '../../services/userServices';
import { error } from 'console';
require('dotenv').config()
// import bcrypt from 'bcrypt'
// import {validate,validateEmail } from '../../use-cases/auth/validation';
// import { generateAccessToken,generateRefreshToken, verifyRefreshToken } from '../../interface/security/jwt';
// import CreateOtp from '../../use-cases/auth/forgetPasswordUsecase';
// import forgetPasswordUsecase from '../../use-cases/auth/forgetPasswordUsecase';
// import GoogleAuthUseCase from '../../use-cases/auth/googleAuth';



const userRepository= new UserRepository()
const registerUser = new RegisterUser(userRepository);
// const createotp=new CreateOtp(userRepository)
// const forgetPasswordusecase=new forgetPasswordUsecase(userRepository)

// const googleuseCase= new GoogleAuthUseCase(userRepository)

// let COOKIESECURE='production'
// const cookieOptions = {
//   httpOnly: true,
//   secure: COOKIESECURE === 'production', 
//   sameSite:  'none' as const , 
// };

// USER REGISTRATION

export const register = async (req: Request, res: Response):Promise<void> => {
  let { username, email, password } = req.body;
  try {
    email = email.toLowerCase()
    const existingUser = await userRepository.findUserByEmail(email)
    if(existingUser){
      res.status(HttpStatusCode.BAD_REQUEST).json({error: 'Email is already in use'})
    }
    const userData = JSON.stringify({ username, email, password })
    console.log("redisClient :",redisClient)
    await redisClient.setEx(`email${email}`,3600,userData)
    res.status(HttpStatusCode.CREATED).json({ message: 'User registered successfully' });
  } catch (err) { 
    if (err instanceof Error) {
      if (err.message === 'Email is already in use') {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Email is already in use' });
      } else if (err.message === 'Invalid email format') {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid email format' });
      } else if (err.message === 'Weak password') {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Weak password' });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
      }
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
  }
}

// OTP GENERATION

export const generateOTP = async (req: Request, res: Response):Promise<void> => {
  let { email } = req.body;
  email = email.toLowerCase()
  const user = await userRepository.findUserByEmail(email);

  if (user) {
    res.status(404).json({ error: 'Email already verified' });
  }

  let otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error sending OTP email' });
  }
};

// OTP VERIFICATION

export const verifyOTP = async(req:Request,res:Response)=>{
  try{
    let {email,otp} = req.body
    const userDataString = await redisClient.get(`email${email}`)
    console.log("userDataString : ",userDataString)
    if(!userDataString){
      res.status(HttpStatusCode.BAD_REQUEST).json({error:"User not found in session"})
    }
    const userData = JSON.parse(userDataString?userDataString:"") as {username:string; email:string; password:string}
    console.log('userData : ',userData)
    email = email.toLowerCase()
    const otpUser = await Otp.findOne({email:email})
    console.log("otpUser : ",otpUser)
    if(!otpUser){
      res.json({error:'User not found or OTP expired'})
    }
    if(otp!==otpUser?.otp){
      res.json({error:'Incorrect OTP'})
    }
    if(otpUser?.expiresAt!==undefined){
      if(otpUser?.expiresAt < new Date()){
        res.json({error:'OTP is expired'})
      }
    }
    await registerUser.registr(userData)
    res.status(HttpStatusCode.OK).json({message:"User registered successfully"})
  }catch(error){
    console.error('Error in verify OTP : ',error)
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message:'Error in verify OTP'})
  }
}

// export const verifyOTP = async (req: Request, res: Response) => {
//   try {
//     let { email, otp } = req.body
//     const userDataString = await redisClient.get(`email${email}`)
//     if (!userDataString) {
//       return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'User not found in session' })
//     }
//     const userData = JSON.parse(userDataString) as { username:string; email: string; password: string }
//     email = email.toLowerCase()
//     const otpUser = await Otp.findOne({ email: email })
//     if (!otpUser) {
//       return res.json({ error: 'User not found or OTP expired' });
//     }
//     if (otp !== otpUser.otp) {
//       return res.json({ error: 'Incorrect OTP' });
//     }
//     if (otpUser.expiresAt < new Date()) {
//       return res.json({ error: 'OTP is expired' });
//     }
//     await registerUser.registr(userData)
//     res.status(HttpStatusCode.OK).json({ message: 'User verified successfully' });
//   } catch (err) {
//     console.error('Error in verify OTP:', err);
//     res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error in verify OTP' });
//   }
// }


// export const loginUser= async(req:Request,res:Response)=>{
//   try{
//     let {email,password}=req.body
//     const checkUserData=validate(email,password)    
//     if(checkUserData && checkUserData.isValid){
//       const user=await userRepository.findByEmail(email)
//       if(user){
//         const bcryptPassword=await bcrypt.compare(password,user.password)
//        if(!bcryptPassword){
//         return res.json({error:"Incorrect password"})
//       }
//       if(user.isBlock){
//         return res.json({error:"User is Blocked by Admin"})
//        }
//         const accessToken= generateAccessToken(user)
//         const refreshToken= generateRefreshToken(user)
//         let userObject=mapUserProfile(user)

//         user.refreshToken =refreshToken
//         userRepository.updateUser(user,user.email)


//         res.cookie('accessToken', accessToken, {
//           ...cookieOptions,
//         });


//         res.cookie('refreshToken', refreshToken, {
//           ...cookieOptions,
//         });


//         return res.status(HttpStatusCode.OK).json({message:"Login successfully",userObject})
//       }else{
//         return res.json({error:"User not found"})
//       }
//     }else{
//       return res.json({error:checkUserData.messages[0]})
//     }
   
//   }catch(err){
//     console.log(err);
//     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:"Error in login",err})  
//   }

// }
// export const refreshAccessTokenController = async (req: Request, res: Response) => {
//   try {
//       const refreshToken=req.cookies.refreshToken?req.cookies.refreshToken:req.cookies.adminrefreshToken
//     if (!refreshToken) {
//       return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Refresh token is required' });
//     }

//     const decoded = verifyRefreshToken(refreshToken);
//     const user = await userRepository.findByEmail(decoded.email);

//     if (user === null) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     if (user.refreshToken !== refreshToken) {
//       res.clearCookie('refreshToken');
//       return res.status(403).json({ error: 'Invalid refresh token' });
//     }

//     if (user.refreshToken === refreshToken) {
//       const newAccessToken = generateAccessToken(user);
//       const newRefreshToken = generateRefreshToken(user);
      
//       user.refreshToken = newRefreshToken; 

    
//       await userRepository.updateUser(user,user.email);
//       res.cookie('accessToken', newAccessToken, {
//         ...cookieOptions,
//         maxAge: 15 * 60 * 1000,
//       });


//       res.cookie('refreshToken', newRefreshToken, {
//         ...cookieOptions,
//         maxAge: 7 * 24 * 60 * 60 * 1000, 
//       });

//       return res.status(HttpStatusCode.OK).json({message:"Access token updated"});
//     } else {
//       return res.status(403).json({ error: 'Invalid refresh token' });
//     }
//   } catch (err) {
//     console.log(err)
//     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
//   }
// };


// export const forgetPassword=async(req:Request,res:Response)=>{
//   try{
//     const {email}=req.body
//     const checkmail=validateEmail(email.toLowerCase())
//     if(!checkmail.isValid)return res.status(HttpStatusCode.BAD_REQUEST).json({error:checkmail.message})
//     const otp= await createotp.createOtp(email)
//     if(otp){
//       return res.status(HttpStatusCode.OK).json({message:"OTP sent successfully"})
//     }  
//     return res.status(HttpStatusCode.BAD_REQUEST).json({error:'User not found'})
//   }catch(err){
//     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
//   }
// }


// export const verifyforgetpasswordOtp=async(req:Request,res:Response)=>{
//   try{
//     let {email,otp}=req.body
//     const checkmail=validateEmail(email.toLowerCase())
//     if(!checkmail.isValid)return res.status(HttpStatusCode.BAD_REQUEST).json({error:checkmail.message})
//     const checkOtp=await forgetPasswordusecase.verifyForgetOtp(email,otp)
//     if(checkOtp=='User Not Found'){
//       res.status(HttpStatusCode.BAD_REQUEST).json({error:"User not found"})
//     }else if(checkOtp=='Incorrect Otp'){
//       res.status(HttpStatusCode.BAD_REQUEST).json({error:"Incorrect otp"})
//     }else if(checkOtp=='Otp has expired'){
//       res.status(HttpStatusCode.BAD_REQUEST).json({error:"Otp has expired please try again later"})
//     }else if(checkOtp=='Otp verified'){
//       res.status(HttpStatusCode.OK).json({message:"Otp verified"})
//     }else{
//       res.status(HttpStatusCode.BAD_REQUEST).json({error:"Something wrong please try again later"})
//     }
    
//   }catch(err){
//     console.log(err);
//     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
//   }
// }


// export  const changePassword=async (req:Request,res:Response)=>{
//   try{
//     const {email,password}=req.body
//     const checkBodyData=validate(email,password)
//     if(!checkBodyData.isValid){
//       return res.status(HttpStatusCode.BAD_REQUEST).json({error:checkBodyData.messages[0]})
//     }
//     const change=await forgetPasswordusecase.changepassword(email,password)
//     if(change=="User not found"){
//       return res.status(HttpStatusCode.BAD_REQUEST).json({error:"User not found"})
//     }else if(change=="User Details Changed"){
//       return res.status(HttpStatusCode.OK).json({message:"User Details Changed"})
//     }else{
//       return res.status(HttpStatusCode.BAD_REQUEST).json({error:"Something wrong please try again later"})
//     }
//   }catch(err){
//     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    
//   }
// }

// export const googleAuth= async (req:Request,res:Response)=>{
//   try{
//     const {userCredential}=req.params
//     const userData= await googleuseCase.handlegoogleAuth(userCredential)
//     if(userData){
//       const accessToken= generateAccessToken(userData)
//       const refreshToken= generateRefreshToken(userData)
//       res.cookie('accessToken', accessToken, {
//         ...cookieOptions,
//         maxAge: 15 * 60 * 1000,
//       });


//       res.cookie('refreshToken', refreshToken, {
//         ...cookieOptions,
//         maxAge: 7 * 24 * 60 * 60 * 1000, 
//       });
//       const userObject= mapUserProfile(userData)
//     return  res.status(HttpStatusCode.OK).json({message:"Login successfully",userObject})
//     }
//     return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Something wrong in login please try again'})
//   }catch(err){
//     console.log(err)
//     return  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:'Internal server error'})
//   }
// }


