import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESSTOKEN_SECRET } from "../config/env";
import { HttpStatusCode } from "../utils/httpStatusCode";

export interface AdminAuthRequest extends Request {
  admin?: JwtPayload;
}

export class AdminAuthMiddleware {
  static async authorizeAdmin(req: AdminAuthRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies?.accessToken;
      if (!accessToken) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided." });
      }
      const decoded = jwt.verify(accessToken, ACCESSTOKEN_SECRET as string) as JwtPayload;
      req.admin = { id: decoded.id, email: decoded.email, role: decoded.role, isAdmin: decoded.admin }
      if (decoded.role !== "admin") {
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: "Forbidden: Admin access only." });
      }
      next();
    } catch (error:any) {
      if (error.name === 'TokenExpiredError') {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access token expired" });
      }
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid or expired token." });
    }
  }
}
