import otpSchema from "../models/otpSchema"



export const createOtp = async(email:string,otp:string,expiresAt:Date)=>{
    return await otpSchema.create({email,otp,expiresAt})
}

export const findOtpByEmail = async(email:string)=>{
    return await otpSchema.findOne({email})
}

export const deleteOtp = async(email:string)=>{
    await otpSchema.deleteOne({email})
}