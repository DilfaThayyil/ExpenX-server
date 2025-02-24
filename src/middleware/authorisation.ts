import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {ACCESSTOKEN_SECRET} from '../config/env'

const accessTokenSecret = ACCESSTOKEN_SECRET
console.log("ACCESSTOKEN_SECRET : ",accessTokenSecret)
export interface AuthRequest extends Request {
  user?: JwtPayload; 
}

export class AuthMiddleware {
  static authenticateUser(req: AuthRequest, res: Response, next: NextFunction): Response | void {
    try {
        console.log("hitting.....AuthMiddleware")
      const token = req.cookies?.accessToken 
      console.log("token : ",token)
      if (!token) {
        console.log("kerunnund....")
        return res.status(401).json({ message: "Access denied. No token provided." });
      }
      console.log("starting decoding token....")
      const decoded = jwt.verify(token, accessTokenSecret as string) as JwtPayload;
      console.log("decoded-AuthMiddleware : ",decoded)
      req.user = decoded; 

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  }
}
