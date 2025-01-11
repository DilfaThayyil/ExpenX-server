import { Request, Response } from 'express';

export interface IAdvisorController {
  register(req: Request, res: Response): Promise<void>;
  generateOTP(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  resendOTP(req:Request,res:Response):Promise<Response>
  loginUser(req: Request, res: Response): Promise<void>;
  refreshAccessTokenController(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  verifyForgotPasswordOtp(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  googleAuth(req: Request, res: Response): Promise<void>;
}
