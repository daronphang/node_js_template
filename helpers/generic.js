const throwErrorObject = (errMsg, statusCode) => {
  const error = new Error(errMsg);
  error.statusCode = statusCode;
  throw error;
};
