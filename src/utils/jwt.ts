// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv'
// dotenv.config()

// const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// if (!JWT_SECRET) {
//   throw new Error('JWT_SECRET is not defined in the environment variables');
// }

// interface JwtPayload {
//   id: string;
//   email: string;
// }

// export const generateJwt = (user: JwtPayload): string => {
//   return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
//     expiresIn: JWT_EXPIRES_IN,
//   });
// };

// export const verifyJwt = (token: string): JwtPayload | null => {
//   try {
//     const decoded = jwt.verify(token,JWT_SECRET)
//     return decoded as JwtPayload
//   } catch (error) {
//     console.error('JWT verification failed:', error);
//     return null;
//   }
// };
