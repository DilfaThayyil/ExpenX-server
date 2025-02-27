import { Request, Response } from 'express';

export interface IAuthAdvisorController {
  register(req: Request, res: Response): Promise<void>;
  generateOTP(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<Response>;
  resendOTP(req:Request,res:Response):Promise<Response>
  loginUser(req: Request, res: Response): Promise<void>;
  refreshAccessTokenController(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  verifyForgotPasswordOtp(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  googleAuth(req: Request, res: Response): Promise<void>;
  logout(req:Request,res:Response):Promise<Response>
}
