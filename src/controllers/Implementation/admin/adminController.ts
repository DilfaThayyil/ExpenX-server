import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAdminController } from "../../Interface/admin/IAdminController";
import { IAdminService } from "../../../services/Interface/admin/IAdminService";
import { HttpStatusCode } from "../../../utils/httpStatusCode";
import { NODE_ENV } from "../../../config/env";
import jwt from "jsonwebtoken";
import { messageConstants } from "../../../utils/messageConstants";
import redisClient from "../../../utils/redisClient";


@injectable()
export default class AdminController implements IAdminController {
  private _adminService: IAdminService

  constructor(@inject('IAdminService') adminService: IAdminService) {
    this._adminService = adminService
  }


  async adminLogin(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const { admin, accessToken, refreshToken } = await this._adminService.adminLogin(email, password);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
        sameSite: 'strict',
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      })
      return res.status(HttpStatusCode.OK).json({ message: messageConstants.LOGIN_SUCCESS, accessToken });
    } catch (error) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: error instanceof Error ? error.message : "Invalid admin credentials",
      });
    }
  }


  async setNewAccessToken(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies?.refreshToken
      const isBlacklisted = await redisClient.get(`bl:${refreshToken}`);
      if (isBlacklisted) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Refresh token is blacklisted." });
      }
      if (!refreshToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: messageConstants.REFRESH_TOKEN })
      const result = await this._adminService.setNewAccessToken(refreshToken)
      if (!result.accessToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: messageConstants.TOKEN_FAILED })
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
        sameSite: 'strict',
      })
      return res.status(HttpStatusCode.OK).json({ message: messageConstants.TOKEN_SUCCESS, accessToken: result.accessToken, success: result.success });
    } catch (err) {
      console.error(err);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: messageConstants.INTERNAL_ERROR });
    }
  }


  async updateAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body
      if (!email || !password) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Email and password are required.' })
      }
      const updatedAdmin = await this._adminService.updateAdmin(name, email, password)
      res.status(HttpStatusCode.OK).json(updatedAdmin)
    } catch (err) {
      console.error(err)
    }
  }  

  async getMonthlyTrends(req: Request, res: Response): Promise<Response> {
    try {
      const months = req.query.months ? parseInt(req.query.months as string) : 6
      const data = await this._adminService.getMonthlyTrends(months)
      return res.status(HttpStatusCode.OK).json(data)
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get monthly trends' })
    }
  }

  async getExpenseCategories(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this._adminService.getExpenseCategories()
      return res.status(HttpStatusCode.OK).json(data)
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve expense categories' })
    }
  }

  async getDashboardStats(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this._adminService.getDashboardStats()
      return res.status(HttpStatusCode.OK).json(data)
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve dashboard stats' })
    }
  }

  async getUserGrowth(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this._adminService.getUserGrowth()
      return res.status(HttpStatusCode.OK).json(data)
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve user growth stats' })
    }
  }


  async adminLogout(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
        const expiry = decoded.exp;

        if (expiry) {
          const currentTime = Math.floor(Date.now() / 1000);
          const ttl = expiry - currentTime;

          await redisClient.set(`bl:${refreshToken}`, "1", {
            EX: ttl,
          });
        }
      }
      res.clearCookie('refreshToken').clearCookie('accessToken');
      return res.status(HttpStatusCode.OK).json({ message: messageConstants.LOGOUT_SUCCESS });
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Error logging out the admin" })
    }
  }
}