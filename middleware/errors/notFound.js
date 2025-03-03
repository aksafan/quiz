const CustomError = require("./../../errors");

const notFound = (req, res) => {
  throw new CustomError.NotFoundError(`Sorry we can't find ${req.originalUrl}`);
};

module.exports = notFound;
