const { StatusCodes, getReasonPhrase } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, response, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong try again later",
  };
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return response.status(customError.statusCode).render(`errors/error`, {
    statusCode: customError.statusCode,
    reasonPhrase: getReasonPhrase(customError.statusCode),
    message: customError.message,
  });
};

module.exports = errorHandlerMiddleware;
