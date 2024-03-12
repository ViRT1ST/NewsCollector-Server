const successResponse = (code, data) => {
  const payload = {
    success: true,
    code,
    data
  };

  return Response.json(payload, { status: payload.code });
};

const errorResponse = (error) => {
  const payload = {
    success: false,
  };

  const { name, code, message } = error;

  payload.code = code || 500;
  payload.message = message || 'Server error';

  if (name && name.match(/^(JsonWebTokenError|TokenExpiredError)$/)) {
    payload.message = 'Token expired or invalid. Please re-authenticate.';
    payload.code = 400;
  }

  if (name && name === 'ValidationError') {
    payload.message = 'Invalid data provided.';
    payload.code = 400;
  }

  return Response.json(payload, { status: payload.code });
};

export {
  successResponse,
  errorResponse
};