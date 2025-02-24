import { Request, Response } from 'express';
import { IAuthUserService } from '../../../services/Interface/user/IAuthuserService';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { IAuthUserController } from '../../Interface/user/IAuthUserController';
import { inject, injectable } from 'tsyringe';
import { ValidationError,NotFoundError,ExpiredError } from '../../../utils/errors';
import { mapUserProfile } from '../../Interface/mappers/userMapper';



@injectable()
export default class AuthUserController implements IAuthUserController {
  private authUserService: IAuthUserService;

  constructor(@inject('IAuthUserService')authUserService: IAuthUserService) {
    this.authUserService = authUserService;
  }


    async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body
      await this.authUserService.register(username, email, password)
      res.status(HttpStatusCode.CREATED).json({ message: 'User registered successfully' })
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage })
    }
  }


    async generateOTP(req: Request, res: Response): Promise<void> {
    try {
      // console.log('body in generateOTP ; ',req.body)
      const { email } = req.body
      await this.authUserService.generateOTP(email);
      res.json({ message: 'OTP sent successfully' });
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error sending OTP email' });
    }
  }

  async resendOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      // console.log('Resend OTP request for email:', email);
      await this.authUserService.resendOTP(email);
      return res.json({ message: 'OTP resent successfully' });
    } catch (err) {
      const errorMessage = err instanceof Error?err.message:'An unexpected error occurred'
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error:errorMessage });
    }
  }
  

  async verifyOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email, otp } = req.body;
      await this.authUserService.verifyOTP(email, otp);
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
  //   async loginUser(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { email, password } = req.body;
  //     const user = await this.authUserService.loginUser(email, password);
  //     console.log("user-controllr : ",user)
  //     res.cookie('accessToken',user.accessToken)
  //     res.status(HttpStatusCode.OK).json({ message: 'Login successfull', user });
  //   } catch (err) {
  //       const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
  //     res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
  //   }
  // }
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.authUserService.loginUser(email, password);
      console.log("LoginUser-controller : ", user);
      const user2 = mapUserProfile(user)
      // Set access token and refresh token in cookies
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

      res.status(HttpStatusCode.OK).json({ message: 'Login successful', user2 });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }
  


  async setNewAccessToken(req: Request, res: Response): Promise<Response> {
    try {
      console.log("starting... setNewAccessToken--------------------RETIU74")
        const refreshToken = req.cookies?.refreshToken;
        console.log("refreshToken : ",refreshToken)
        if (!refreshToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "No token provided" });
        const result = await this.authUserService.setNewAccessToken(refreshToken);
        console.log("-----result--- : ",result)
        if (!result.accessToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Failed to generate token' });
        res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000, sameSite: 'strict' });
        return res.status(HttpStatusCode.OK).json({ message: "Token set successfully", success: result.success });
    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}


    async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authUserService.forgotPassword(email);
      res.json({ message: 'Forgot password OTP sent successfully' });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }


  async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      await this.authUserService.verifyForgotPasswordOtp(email, otp);
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



  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      await this.authUserService.resetPassword(email, password);
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
      const { userCredential } = req.body
      const username = userCredential.name
      const email = userCredential.email 
      const password = userCredential.sub
      const profilePic = userCredential.picture
      const user = await this.authUserService.googleAuth(username,email,password,profilePic)
      // console.log("user in controllr: ",user)
      
      res.status(HttpStatusCode.OK).json({ message: 'You authenticated via Google', user })
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage })
    }
  }



  async logout(req: Request, res: Response): Promise<Response> {
    console.log('calling logout ..................6666666666555555')
    try {
        res.clearCookie('refreshToken').clearCookie('accessToken');
        return res.status(HttpStatusCode.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to logout' });
    }
  }


  
}


