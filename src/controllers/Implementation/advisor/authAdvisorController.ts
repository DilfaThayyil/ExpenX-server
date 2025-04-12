import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../utils/httpStatusCode'
import { inject, injectable } from 'tsyringe';
import { IAuthAdvisorController } from '../../Interface/advisor/IAuthAdvisorController';
import { IAuthAdvisorService } from '../../../services/Interface/advisor/IAuthAdvisorService';
import { NotFoundError, ValidationError, ExpiredError } from '../../../utils/errors';
import { mapUserProfile } from '../../Interface/mappers/userMapper';
import { messageConstants } from '../../../utils/messageConstants';
import redisClient from '../../../utils/redisClient';
import jwt from "jsonwebtoken";



@injectable()
export default class AuthAdvisorController implements IAuthAdvisorController {
  private authAdvisorService: IAuthAdvisorService;

  constructor(@inject('IAuthAdvisorService') authAdvisorService: IAuthAdvisorService) {
    this.authAdvisorService = authAdvisorService;
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log('register-contrll-advisor ----sdkjfksdjf')
      const { username, email, password } = req.body;
      console.log("req.body : ", req.body)
      const regi = await this.authAdvisorService.register(username, email, password);
      console.log("regi ===> , ", regi)
      console.log(' ====> =====> ======> success register')
      res.status(HttpStatusCode.CREATED).json({ message: 'User registered successfully' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR;
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async generateOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authAdvisorService.generateOTP(email);
      res.json({ message: 'OTP sent successfully' });
    } catch (err) {
      console.error("Error sending otp email : ", err)
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error sending OTP email' });
    }
  }

  async resendOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body
      await this.authAdvisorService.resendOTP(email)
      return res.json({ message: 'OTP resent successfullt' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<Response> {
    try {
      // console.log('req body in controllr : ',req.body)
      const { email, otp } = req.body;
      await this.authAdvisorService.verifyOTP(email, otp);
      return res.status(HttpStatusCode.OK).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: 'OTP not found.' });
      } else if (err instanceof ValidationError) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Invalid OTP.' });
      } else if (err instanceof ExpiredError) {
        return res.status(HttpStatusCode.GONE).json({ success: false, message: 'OTP expired.' });
      } else {
        const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR;
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage });
      }
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.authAdvisorService.loginUser(email, password);
      console.log("advisor-controller : ",user)
      const user2 = mapUserProfile(user)
      console.log("user2 : ",user2)
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
      const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR;
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async setNewAccessToken(req: Request, res: Response): Promise<Response> {
    try {
      console.log("starting... setNewAccessToken--------------------RETIU74")
      const refreshToken = req.cookies?.refreshToken;
      console.log("refreshToken : ", refreshToken)
      const isBlacklisted = await redisClient.get(`bl:${refreshToken}`);
      if (isBlacklisted) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Refresh token is blacklisted." });
      }
      if (!refreshToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "No refresh token provided" });
      const result = await this.authAdvisorService.setNewAccessToken(refreshToken);
      console.log("-----result--- : ", result)
      if (!result.accessToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Failed to generate token' });
      // res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60*60*1000, sameSite: 'strict' });
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
        sameSite: 'strict',
      })
      return res.status(HttpStatusCode.OK).json({ message: "Token set successfully", accessToken: result.accessToken, success: result.success });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: messageConstants.INTERNAL_ERROR });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authAdvisorService.forgotPassword(email);
      res.json({ message: 'Forgot password OTP sent successfully' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR;
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      await this.authAdvisorService.verifyForgotPasswordOtp(email, otp);
      res.status(HttpStatusCode.OK).json({ success: true, message: 'OTP verified successfully' });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: 'No OTP record found for this email.' });
      } else if (err instanceof ValidationError) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'The OTP you entered is incorrect.' });
      } else if (err instanceof ExpiredError) {
        res.status(HttpStatusCode.GONE).json({ success: false, message: 'The OTP has expired. Please request a new one.' });
      } else {
        const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR;
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
      console.error('Error resetting password : ', err)
      const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR;
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { userCredential } = req.body;
      const username = userCredential.name;
      const email = userCredential.email;
      const password = userCredential.sub
      const profilePic = userCredential.picture
      const {existingUser,accessToken,refreshToken} = await this.authAdvisorService.googleAuth(username, email,password, profilePic);
      console.log("existingAdvisor-googleAuth : ",existingUser)
      console.log("accessToken-googleAuth : ",accessToken)
      console.log("refreshToken-googleAuth : ",refreshToken)
      const user2 = mapUserProfile(existingUser)
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
        sameSite: 'strict',
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      })
      res.status(HttpStatusCode.OK).json({ message: messageConstants.LOGIN_SUCCESS, user2 });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR;
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    console.log("advisor logging out.....")
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
        const expiry = decoded.exp;

        if (expiry) {
          const currentTime = Math.floor(Date.now() / 1000);
          const ttl = expiry - currentTime;

          await redisClient.set(`bl:${refreshToken}`, "1", {
            EX: ttl, // expire same time as token
          });
        }
      }
      res.clearCookie('refreshToken').clearCookie('accessToken');
      return res.status(HttpStatusCode.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to logout' });
    }
  }
}
