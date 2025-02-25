import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESSTOKEN_SECRET } from '../config/env';
import UserRepository from "../repositories/Implementation/userRepository";

const userRepository = new UserRepository();

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export class AuthMiddleware {
  static async authorizeUser(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      console.log("🔹 AuthMiddleware Hit");
      const token = req.cookies?.accessToken;
      if (!token) {
        console.log("❌ No access token found.");
        return res.status(401).json({ message: "Access denied. No token provided." });
      }

      console.log("🔹 Decoding access token...");
      const decoded = jwt.verify(token, ACCESSTOKEN_SECRET as string) as JwtPayload;
      req.user = decoded;

      console.log("✅ Token verified:", decoded);
      const user = await userRepository.findUserById(decoded.id);
      if (!user) {
        console.log("❌ User not found in database.");
        return res.status(401).json({ message: "User not found." });
      }

      if (user.isBlocked) {
        console.log(`❌ User ${decoded.id} is blocked.`);
        return res.status(403).json({ message: "You have been blocked by the admin." });
      }

      next();
    } catch (error) {
      console.log("❌ Invalid or expired token.");
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  }
}
