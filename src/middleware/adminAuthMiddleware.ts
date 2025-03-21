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
      const token = req.cookies?.adminToken;
      if (!token) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided." });
      }
      const decoded = jwt.verify(token, ACCESSTOKEN_SECRET as string) as JwtPayload;
      req.admin = decoded;

      if (decoded.role !== "admin") {
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: "Forbidden: Admin access only." });
      }
      next();
    } catch (error) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid or expired token." });
    }
  }
}
