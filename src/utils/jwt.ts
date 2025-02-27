import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESSTOKEN_SECRET, REFRESHTOKEN_SECRET } from '../config/env';

// Ensure the secrets are defined
if (!ACCESSTOKEN_SECRET || !REFRESHTOKEN_SECRET) {
  throw new Error("JWT secrets are missing. Check your environment variables.");
}

const accessTokenSecret = ACCESSTOKEN_SECRET as string;
const refreshTokenSecret = REFRESHTOKEN_SECRET as string;

export const generateAccessToken = (user: any): string => {
  return jwt.sign(
    { id: user._id, email: user.email, admin: user.isAdmin, role: user.role },
    accessTokenSecret,
    { expiresIn: '50m' }
  );
};

export const generateRefreshToken = (user: any): string => {
  return jwt.sign(
    { id: user._id, email: user.email, admin: user.isAdmin, role:user.role},
    refreshTokenSecret,
    { expiresIn: '7d' }
  );
};

export const verifyAccessToken = (token: string): JwtPayload | undefined => {
  try {
    return jwt.verify(token, accessTokenSecret) as JwtPayload;
  } catch (err) {
    return undefined;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, refreshTokenSecret) as JwtPayload;
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
};
