export interface IAuthAdvisorService {
    register(username: string, email: string, password: string): Promise<void>;
    generateOTP(email: string): Promise<void>;
    resendOTP(email:string):Promise<void>
    verifyOTP(email: string, otp: string): Promise<void>;
    loginUser(email: string, password: string): Promise<any>;
    setNewAccessToken(refreshToken: string): Promise<any>;
    forgotPassword(email: string): Promise<void>;
    verifyForgotPasswordOtp(email: string, otp: string): Promise<void>;
    resetPassword(email: string, newPassword: string): Promise<void>;
    googleAuth(username:string,email: string,password:string,profilePic:string): Promise<any>;
  }
  