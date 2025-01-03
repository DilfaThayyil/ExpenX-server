import jwt,{JwtPayload}  from "jsonwebtoken";


const accessTokenSecret='access_secret'
const refreshTokenSecret ='refresh_secret'

export const generateAccessToken=(user:any)=>{
    return jwt.sign({id:user._id,email:user.email,role:user.isAdmin},accessTokenSecret,{ expiresIn: '50m' })
}

export const generateRefreshToken=(user:any)=>{
    return jwt.sign({id:user._id,email:user.email,role:user.isAdmin},refreshTokenSecret,{ expiresIn: '7d' })
}

export const verifyAccessToken = (token: string): JwtPayload | undefined => {
    try {
      return jwt.verify(token, accessTokenSecret) as JwtPayload;
    } catch (err) {
      return undefined;
    }
  };


export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
      const decoded = jwt.verify(token, refreshTokenSecret) as JwtPayload;
      return decoded;
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  };