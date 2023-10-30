const jwt = require('jsonwebtoken');

const User = require('../models/user');
const sendErrorResponse = require('../responses/failure');
const ExtendedError = require('../errors/exterror');

const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      throw new ExtendedError(401, 'Token not found. Please relogin.');
    }

    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const condition = { _id: decoded._id, 'tokens': token };
    const user = await User.findOne(condition);

    if (!user) {
      throw new ExtendedError(401, 'Authenticate to continue');
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = auth;
