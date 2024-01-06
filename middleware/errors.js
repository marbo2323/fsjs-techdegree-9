const statusError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = (message = "Resourse not found") => {
  return statusError(message, 404);
};

const forbiddenError = (message = "Execute access forbidden") => {
  return statusError(message, 403);
};

module.exports = { statusError, notFoundError, forbiddenError };
