/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOtpRepository {
    createOrUpdateOtp(userId: string, otp: number, expiresAt: Date): Promise<any>;
    findOtpByUserId(userId: string): Promise<any>;
    verifyOtp(userId: string, otp: number): Promise<any>;
    deleteOtp(userId: string): Promise<any>;
  }
  