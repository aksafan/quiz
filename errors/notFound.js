const { StatusCodes } = require("http-status-codes");
const CustomError = require("./customError");
const errors = require("./../constants/errors");

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = errors.NOT_FOUND_ERROR;
  }
}

module.exports = NotFoundError;
