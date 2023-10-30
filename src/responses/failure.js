function sendErrorResponse(err, res) {
  let { name, message, code = 500 } = err;

  if (name.match(/^(JsonWebTokenError|TokenExpiredError)$/)) {
    message = 'Token expired or invalid. Please re-authenticate.';
    code = 400;
  }

  if (name === 'ValidationError') {
    code = 400;
  }

  const response = {
    success: false,
    statusCode: code,
    message,
  };

  res.status(code).send(response);
}

module.exports = sendErrorResponse;
