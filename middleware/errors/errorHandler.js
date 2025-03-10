const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const errors = require("../../constants/customErrors");

const errorHandlerMiddleware = (err, req, response, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong try again later",
  };
  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "CastError") {
    customError.message = `No item found with id : ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  if (err.name === errors.NOT_FOUND_ERROR) {
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return response.status(customError.statusCode).render(`errors/error`, {
    statusCode: customError.statusCode,
    reasonPhrase: getReasonPhrase(customError.statusCode),
    message: customError.message,
  });
};

module.exports = errorHandlerMiddleware;
