const sendErrorResponse = require('../responses/failure');

function errorHandler(err, req, res, next) {
  sendErrorResponse(err, res);
}

module.exports = errorHandler;
