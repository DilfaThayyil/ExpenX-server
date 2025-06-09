import { Response } from 'express';
import { NODE_ENV } from '../config/env';

const isProduction = NODE_ENV === 'production';

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
};

export const setAccessTokenCookie = (res: Response, accessToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 1000, 
    sameSite: isProduction ? 'none' : 'lax',
  });
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    sameSite: isProduction ? 'none' : 'lax',
  });
};
