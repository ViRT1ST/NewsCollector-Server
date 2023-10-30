function sendSuccessResponse(code, data, res) {
  const response = {
    success: true,
    statusCode: code,
  };

  if (data) {
    response.data = data;
  }

  res.status(code).send(response);
}

module.exports = sendSuccessResponse;
