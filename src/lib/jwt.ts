import jwt from 'jsonwebtoken';

import { JWT_SECRET, JWT_EXP_SECONDS } from '@/config/secret';

function generate(uuid: string): string {
  const nowDateInSeconds = Math.floor(Date.now() / 1000);
  const exp = nowDateInSeconds + parseInt(JWT_EXP_SECONDS, 10);

  const payload = { uuid, exp };
  const token = jwt.sign(payload, JWT_SECRET);

  return token;
}

function stripToken(token: unknown) {
  return typeof token == 'string'
    ? token.replace('Bearer ', '')
    : token;
}

function verifyAndGetPayload(token: any) {
  let payload: jwt.JwtPayload | string;

  try {
    // if token is valid - returns payload or string
    // if token is invalid or expired - throws error
    payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload == 'string') {
      payload = {};
    }

  } catch (error) {
    payload = {};
  }

  return payload;
}

export default {
  generate,
  stripToken,
  verifyAndGetPayload
};
