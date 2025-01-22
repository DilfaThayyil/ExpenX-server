import { Request, Response } from 'express';

export interface IAuthUserController {
  register(req: Request, res: Response): Promise<void>
  generateOTP(req: Request, res: Response): Promise<void>
  verifyOTP(req: Request, res: Response): Promise<Response>
  resendOTP(req: Request, res: Response): Promise<Response>
  loginUser(req: Request, res: Response): Promise<void>
  setNewAccessToken(req: Request, res: Response): Promise<Response>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  verifyForgotPasswordOtp(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  googleAuth(req: Request, res: Response): Promise<void>;
  // logout(req: Request,res:Response):Promise<Response>
}
