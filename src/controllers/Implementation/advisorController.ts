import { Request, Response } from 'express';
import { HttpStatusCode } from '../../utils/httpStatusCode';
import { inject, injectable } from 'tsyringe';
import { IAdvisorController } from '../Interface/IAdvisorController';
import { IAdvisorService } from '../../services/Interface/IAdvisorService';

@injectable()
export default class AdvisorController implements IAdvisorController {
  private advisorService: IAdvisorService;

  constructor(@inject('IAdvisorService')advisorService: IAdvisorService) {
    this.advisorService = advisorService;
  }

    async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      await this.advisorService.register(username, email, password);
      res.status(HttpStatusCode.CREATED).json({ message: 'User registered successfully' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async generateOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.advisorService.generateOTP(email);
      res.json({ message: 'OTP sent successfully' });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error sending OTP email' });
    }
  }

    async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      await this.advisorService.verifyOTP(email, otp);
      res.status(HttpStatusCode.OK).json({ message: 'User registered successfully' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.advisorService.loginUser(email, password);
      res.status(HttpStatusCode.OK).json({ message: 'Login successfully', user });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async refreshAccessTokenController(req: Request, res: Response): Promise<void> {
    try {
      const newTokens = await this.advisorService.refreshAccessToken(req.cookies.refreshToken);
      res.cookie('accessToken', newTokens.accessToken);
      res.cookie('refreshToken', newTokens.refreshToken);
      res.status(HttpStatusCode.OK).json({ message: 'Access token updated' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.advisorService.forgotPassword(email);
      res.json({ message: 'Forgot password OTP sent successfully' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      await this.advisorService.verifyForgotPasswordOtp(email, otp);
      res.status(HttpStatusCode.OK).json({ success:true, message: 'OTP verified successfully' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      await this.advisorService.resetPassword(email, password);
      res.status(HttpStatusCode.OK).json({ message: 'Password changed successfully' });
    } catch (err) {
      console.error('Error resetting password : ',err)
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      console.log('recieved body : ',req.body)
      const { userCredential } = req.body;
      const username = userCredential.name;
      const email = userCredential.email;
      const profilePic = userCredential.picture
      const user = await this.advisorService.googleAuth(username,email,profilePic);
      res.status(HttpStatusCode.OK).json({ message: 'User authenticated via Google', user });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }
}
