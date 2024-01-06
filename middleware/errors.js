const statusError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = (message) => {
  return statusError(message, 404);
};

module.exports = { statusError, notFoundError };
