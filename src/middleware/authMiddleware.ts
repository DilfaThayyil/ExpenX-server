import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESSTOKEN_SECRET } from "../config/env";
import UserRepository from "../repositories/Implementation/userRepository";
import AdvisorRepository from "../repositories/Implementation/advisorRepository";

const userRepository = new UserRepository();
const advisorRepository = new AdvisorRepository();

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

      let entity;
      if (decoded.role === "user") {
        entity = await userRepository.findUserById(decoded.id);
      } else if (decoded.role === "advisor") {
        entity = await advisorRepository.findUserById(decoded.id);
      }

      if (!entity) {
        console.log(`❌ ${decoded.role} not found in database.`);
        return res.status(401).json({ message: `${decoded.role} not found.` });
      }

      if (entity.isBlocked) {
        console.log(`❌ ${decoded.role} ${decoded.id} is blocked.`);
        return res.status(403).json({ message: "You have been blocked by the admin." });
      }

      next();
    } catch (error) {
      console.log("❌ Invalid or expired token.");
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  }
}
