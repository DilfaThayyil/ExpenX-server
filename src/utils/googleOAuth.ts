import { OAuth2Client } from 'google-auth-library';
import { GOOGLECLIENTID } from '../config/env';

const client = new OAuth2Client(GOOGLECLIENTID);

export const googleVerify = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLECLIENTID,
  });
  return ticket.getPayload();
};
