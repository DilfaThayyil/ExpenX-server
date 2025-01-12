import { Request, Response } from 'express';
import { IUserService } from '../../services/Interface/IUserService';
import { HttpStatusCode } from '../../utils/httpStatusCode';
import { IUserController } from '../Interface/IUserController';
import { inject, injectable } from 'tsyringe';
import { ValidationError,NotFoundError,ExpiredError } from '../../utils/errors';



@injectable()
export default class UserController implements IUserController {
  private userService: IUserService;

  constructor(@inject('IUserService')userService: IUserService) {
    this.userService = userService;
  }

  /////////////////////////////////////////// USER REGISTRATION ///////////////////////////////////////////

    async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body
      await this.userService.register(username, email, password)
      res.status(HttpStatusCode.CREATED).json({ message: 'User registered successfully' })
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage })
    }
  }

  /////////////////////////////////////////// OTP GENERATION ///////////////////////////////////////////////

    async generateOTP(req: Request, res: Response): Promise<void> {
    try {
      console.log('body in generateOTP ; ',req.body)
      const { email } = req.body
      await this.userService.generateOTP(email);
      res.json({ message: 'OTP sent successfully' });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error sending OTP email' });
    }
  }

  //////////////////////////////////////////// RESEND OTP ////////////////////////////////////////////////////
  async resendOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      console.log('Resend OTP request for email:', email);
      await this.userService.resendOTP(email);
      return res.json({ message: 'OTP resent successfully' });
    } catch (err) {
      const errorMessage = err instanceof Error?err.message:'An unexpected error occurred'
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error:errorMessage });
    }
  }
  

  //////////////////////////////////////////// OTP VERIFICATION //////////////////////////////////////////////
  async verifyOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email, otp } = req.body;
      await this.userService.verifyOTP(email, otp);
      return res.status(HttpStatusCode.OK).json({ success: true, message: 'User registered successfully' });
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

  //////////////////////////////////////////// USER LOGIN /////////////////////////////////////////////////
    async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.userService.loginUser(email, password);
      res.status(HttpStatusCode.OK).json({ message: 'Login successfull', user });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  ////////////////////////////////////////// REFRESH TOKEN /////////////////////////////////////////////////
    async refreshAccessTokenController(req: Request, res: Response): Promise<void> {
    try {
      const newTokens = await this.userService.refreshAccessToken(req.cookies.refreshToken);
      res.cookie('accessToken', newTokens.accessToken);
      res.cookie('refreshToken', newTokens.refreshToken);
      res.status(HttpStatusCode.OK).json({ message: 'Access token updated' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  ///////////////////////////////////////// FORGOT PASSWORD /////////////////////////////////////////////////
    async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.userService.forgotPassword(email);
      res.json({ message: 'Forgot password OTP sent successfully' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  //////////////////////////////////////// VERIFY FORGOT PASSWORD OTP /////////////////////////////////////////
  async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      await this.userService.verifyForgotPasswordOtp(email, otp);
      res.status(HttpStatusCode.OK).json({ success: true, message: 'OTP verified successfully' });
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

  /////////////////////////////////////// CHANGE PASSWORD /////////////////////////////////////////////////
    async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      await this.userService.resetPassword(email, password);
      res.status(HttpStatusCode.OK).json({ message: 'Password changed successfully' });
    } catch (err) {
      console.error('Error resetting password : ',err)
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  //////////////////////////////////////// GOOGLE AUTHENTICATION //////////////////////////////////////////////
    async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      console.log('recieved body : ',req.body)
      const { userCredential } = req.body
      const username = userCredential.name
      const email = userCredential.email
      const profilePic = userCredential.picture
      const user = await this.userService.googleAuth(username,email,profilePic)
      res.status(HttpStatusCode.OK).json({ message: 'You authenticated via Google', user })
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage })
    }
  }
}
