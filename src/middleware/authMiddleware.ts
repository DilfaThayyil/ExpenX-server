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
      const accessToken = req.cookies?.accessToken;
      if (!accessToken) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided." });
      }
      const decoded = jwt.verify(accessToken, ACCESSTOKEN_SECRET as string) as JwtPayload;
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role, isAdmin: decoded.admin };
      let entity;
      if (decoded.role === "user") {
        entity = await userRepository.findUserById(decoded.id);
      } else if (decoded.role === "advisor") {
        entity = await advisorRepository.findUserById(decoded.id);
      }
      if (!entity) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: `${decoded.role} not found.` });
      }

      if (entity.isBlocked) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: "You have been blocked by the admin." });
      }
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
