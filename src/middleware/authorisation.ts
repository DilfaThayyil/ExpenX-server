import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESSTOKEN_SECRET } from '../config/env';
import UserRepository from "../repositories/Implementation/userRepository";

const accessTokenSecret = ACCESSTOKEN_SECRET;
console.log("ACCESSTOKEN_SECRET : ", accessTokenSecret);
const userRepository = new UserRepository()

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export class AuthMiddleware {
  static async authorizeUser(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      console.log("Hitting AuthMiddleware...");
      const token = req.cookies?.accessToken;
      console.log("Token: ", token);
      if (!token) {
        console.log("No token provided...");
        return res.status(401).json({ message: "Access denied. No token provided." });
      }
      console.log("Decoding token...) ) ) ) ( ( (");
      const decoded = jwt.verify(token, accessTokenSecret as string) as JwtPayload;
      console.log("Decoded AuthMiddleware: ", decoded);
      req.user = decoded;
      const user = await userRepository.findUserById(decoded.userId);
      if (!user) {
        console.log("!!! No user is found in middleware !!!")
        return res.status(401).json({ message: "User not found." });
      }
      if (user.isBlocked) {
        console.log(`User ${decoded.userId} is blocked. Logging out...`);
        res.clearCookie('refreshToken').clearCookie('accessToken');
        return res.status(403).json({ message: "You have been blocked by the admin." });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  }
}
