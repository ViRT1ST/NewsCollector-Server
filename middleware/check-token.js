require('dotenv').config();

const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ error: 'Token not found. Please relogin.' });
  }

  try {
    const privateKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, privateKey);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ error: 'Invalid or expired token. Please relogin.' });
  }
}

module.exports = checkToken;
