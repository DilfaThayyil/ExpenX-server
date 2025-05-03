import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESSTOKEN_SECRET } from "../config/env";
import UserRepository from "../repositories/Implementation/userRepository";
import AdvisorRepository from "../repositories/Implementation/advisorRepository";
import { HttpStatusCode } from "../utils/httpStatusCode";

const userRepository = new UserRepository();
const advisorRepository = new AdvisorRepository();

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export class AuthMiddleware {
  static async authorizeUser(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      console.log("[AuthMiddleware] Checking for access token in cookies...");
      const accessToken = req.cookies?.accessToken;
      if (!accessToken) {
        console.log("[AuthMiddleware] No access token found.");
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided." });
      }
      console.log("[AuthMiddleware] Verifying access token...");
      const decoded = jwt.verify(accessToken, ACCESSTOKEN_SECRET as string) as JwtPayload;
      console.log("[AuthMiddleware] Token verified. Decoded payload:", decoded);
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role, isAdmin: decoded.admin };
      console.log("[AuthMiddleware] Set req.user:", req.user);

      let entity;
      if (decoded.role === "user") {
        console.log("[AuthMiddleware] Role is user. Looking up user in repository...");
        entity = await userRepository.findUserById(decoded.id);
      } else if (decoded.role === "advisor") {
        console.log("[AuthMiddleware] Role is advisor. Looking up advisor in repository...");
        entity = await advisorRepository.findUserById(decoded.id);
      }
      if (!entity) {
        console.log(`[AuthMiddleware] ${decoded.role} not found in database.`);
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: `${decoded.role} not found.` });
      }

      if (entity.isBlocked) {
        console.log("[AuthMiddleware] User is blocked.");
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: "You have been blocked by the admin." });
      }
      console.log("[AuthMiddleware] Authorization successful. Proceeding to next middleware...");
      next();
    } catch (error: any) {
      console.error("[AuthMiddleware] Error occurred during authorization:", error);
      if (error.name === 'TokenExpiredError') {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access token expired" });
      }
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid or expired token." });
    }
  }
}
