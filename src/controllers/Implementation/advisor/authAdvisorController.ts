import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../utils/httpStatusCode' 
import { inject, injectable } from 'tsyringe';
import { IAuthAdvisorController } from '../../Interface/advisor/IAuthAdvisorController';
import { IAuthAdvisorService } from '../../../services/Interface/advisor/IAuthAdvisorService';
import { NotFoundError, ValidationError, ExpiredError } from '../../../utils/errors';
import { mapUserProfile } from '../../Interface/mappers/userMapper';

@injectable()
export default class AuthAdvisorController implements IAuthAdvisorController {
  private authAdvisorService: IAuthAdvisorService;

  constructor(@inject('IAuthAdvisorService')authAdvisorService: IAuthAdvisorService) {
    this.authAdvisorService = authAdvisorService;
  }

    async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      await this.authAdvisorService.register(username, email, password);
      res.status(HttpStatusCode.CREATED).json({ message: 'User registered successfully' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async generateOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authAdvisorService.generateOTP(email);
      res.json({ message: 'OTP sent successfully' });
    } catch (err) {
      console.error("Error sending otp email : ",err)
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error sending OTP email' });
    }
  }

  async resendOTP(req:Request,res:Response):Promise<Response>{
    try{
      const {email} = req.body
      await this.authAdvisorService.resendOTP(email)
      return res.json({message: 'OTP resent successfullt'})
    }catch(err){
      const errorMessage = err instanceof Error?err.message:'An unexpected error occurred'
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error:errorMessage });
    }
  }

    async verifyOTP(req: Request, res: Response): Promise<Response> {
    try {
      // console.log('req body in controllr : ',req.body)
      const { email, otp } = req.body;
      await this.authAdvisorService.verifyOTP(email, otp);
      return res.status(HttpStatusCode.OK).json({success:true, message: 'User registered successfully' });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: 'OTP not found.' });
      } else if (err instanceof ValidationError) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Invalid OTP.' });
      } else if (err instanceof ExpiredError) {
        return res.status(410).json({ success: false, message: 'OTP expired.' });
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage });
      }
    }
  }

    async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.authAdvisorService.loginUser(email, password);
      // console.log("advisor-controller : ",user)
      const user2 = mapUserProfile(user)
      //set access token and refresh token in cookies
      res.cookie('accessToken', user.accessToken, {
        httpOnly: true,  
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 15 * 60 * 1000, 
        sameSite: 'lax', 
      })
      res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, 
        sameSite: 'lax',
      })
      res.status(HttpStatusCode.OK).json({ message: 'Login successfully', user2 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async refreshAccessTokenController(req: Request, res: Response): Promise<void> {
    try {
      const newTokens = await this.authAdvisorService.refreshAccessToken(req.cookies.refreshToken);
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
      await this.authAdvisorService.forgotPassword(email);
      res.json({ message: 'Forgot password OTP sent successfully' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      await this.authAdvisorService.verifyForgotPasswordOtp(email, otp);
      res.status(HttpStatusCode.OK).json({ success:true, message: 'OTP verified successfully' });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: 'No OTP record found for this email.' });
      } else if (err instanceof ValidationError) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'The OTP you entered is incorrect.' });
      } else if (err instanceof ExpiredError) {
        res.status(410).json({ success: false, message: 'The OTP has expired. Please request a new one.' });
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage });
      }
    }
  }

    async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      await this.authAdvisorService.resetPassword(email, password);
      res.status(HttpStatusCode.OK).json({ message: 'Password changed successfully' });
    } catch (err) {
      console.error('Error resetting password : ',err)
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

    async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      // console.log('recieved body : ',req.body)
      const { userCredential } = req.body;
      const username = userCredential.name;
      const email = userCredential.email;
      const profilePic = userCredential.picture
      const user = await this.authAdvisorService.googleAuth(username,email,profilePic);
      res.status(HttpStatusCode.OK).json({ message: 'You authenticated via Google', user });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }
}
