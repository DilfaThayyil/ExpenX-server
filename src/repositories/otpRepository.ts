import otpSchema from "../models/otpSchema"



export const findOtpByEmail = async(email:string)=>{
    return await otpSchema.findOne({email})
}

export const deleteOtp = async(email:string)=>{
    await otpSchema.deleteOne({email})
}