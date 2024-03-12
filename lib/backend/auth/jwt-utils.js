import jwt from 'jsonwebtoken';

const generateToken = (_id) => {
  const nowDateInSeconds = Math.floor(Date.now() / 1000);
  const exp = nowDateInSeconds + parseInt(process.env.JWT_EXP_SECONDS, 10);

  const payload = { exp, _id: _id.toString() };
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
};

const cleanToken = (token) => {
  return token.replace('Bearer ', '');
};

const verifyTokenAndGetPayload = (token) => {
  // will throw error if token is invalid or expired
  // will return payload if token is valid
  return jwt.verify(token, process.env.JWT_SECRET);
};

export {
  generateToken,
  cleanToken,
  verifyTokenAndGetPayload
};