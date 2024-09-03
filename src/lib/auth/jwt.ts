import jwt from 'jsonwebtoken';

const expiration = process.env.JWT_EXP_SECONDS || '2592000';
const secret = process.env.JWT_SECRET || 'temporary_secret';

function generate(uuid: string): string {
  const nowDateInSeconds = Math.floor(Date.now() / 1000);
  const exp = nowDateInSeconds + parseInt(expiration, 10);

  const payload = { uuid, exp };
  const token = jwt.sign(payload, secret);

  return token;
}

// ok
function stripToken(token: unknown) {
  return typeof token == 'string'
    ? token.replace('Bearer ', '')
    : token;
}

// ok
function verifyAndGetPayload(token: any) {
  let payload: jwt.JwtPayload | string;

  try {
    // if token is valid - returns payload or string
    // if token is invalid or expired - throws error
    payload = jwt.verify(token, secret);

    if (typeof payload == 'string') {
      payload = {};
    }

  } catch (error) {
    payload = {};
  }

  return payload;
};


export default {
  generate,
  stripToken,
  verifyAndGetPayload,
};
