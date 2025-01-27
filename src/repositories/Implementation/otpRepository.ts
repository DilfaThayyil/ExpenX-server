/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOtpRepository } from '../Interface/IOtpRepository';
import otpSchema from '../../models/otpSchema';

export class OtpRepository implements IOtpRepository {

   async createOrUpdateOtp(userId: string, otp: number, expiresAt: Date): Promise<any> {
    return await otpSchema.findOneAndUpdate(
      { userId },
      { otp, expr: expiresAt },
      { new: true, upsert: true }
    );
  }

   async findOtpByUserId(userId: string): Promise<any> {
    return await otpSchema.findOne({ userId });
  }

   async verifyOtp(userId: string, otp: number): Promise<any> {
    const otpRecord = await otpSchema.findOne({ userId, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return null; 
    }
    return otpRecord;
  }

   async deleteOtp(userId: string): Promise<any> {
    return await otpSchema.deleteOne({ userId });
  }
}
