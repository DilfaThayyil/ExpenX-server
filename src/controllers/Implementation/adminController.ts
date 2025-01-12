import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { HttpStatusCode } from "../../utils/httpStatusCode";
import jwt from "jsonwebtoken";

const accessTokenSecret = "access_secret"
const refreshTokenSecret = "refresh_secret"
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD; 



/////////////////////////// ADMIN LOGIN /////////////////////

export const adminLogin = async (req: Request, res: Response) => {
  try {
    console.log("req body : ",req.body)
    const { email, password } = req.body;

    if (email !== adminEmail) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Invalid email or password" });
    }

    if (password !== adminPassword) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Invalid email or password" });
    }
    const accessToken = jwt.sign({ email: adminEmail }, accessTokenSecret, { expiresIn: "50m" });
    const refreshToken = jwt.sign({ email: adminEmail }, refreshTokenSecret, { expiresIn: "7d" });

    console.log("access : ",accessToken)
    console.log("refresh : ",refreshToken)
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(HttpStatusCode.OK).json({ message: "Admin logged in successfully", accessToken });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};



//////////////////////// HANDLE REFRESH TOKEN /////////////////

// export const adminRefreshToken = async (req: Request, res: Response) => {
//   try {
//     const refreshToken = req.cookies?.jwt;

//     if (!refreshToken) {
//       return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Refresh token not found" });
//     }

//     jwt.verify(refreshToken, refreshTokenSecret, (err: any, decoded: any) => {
//       if (err) {
//         return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Unauthorized" });
//       }

//       // Generate new access token
//       const accessToken = jwt.sign({ email: decoded.email }, accessTokenSecret, { expiresIn: "50m" });
//       return res.status(HttpStatusCode.OK).json({ accessToken });
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
//   }
// };
