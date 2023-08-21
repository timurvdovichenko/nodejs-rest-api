const errorMassageList = {
  400: 'Bad request',
  401: 'Not authorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
};

const HttpError = (status, message = errorMassageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
