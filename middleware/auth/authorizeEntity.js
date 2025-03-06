const { checkPermissions } = require("../../utils");
const CustomError = require("../../errors");

const authorizeEntity = (entity, req, res, next) => {
  if (!req[entity]) {
    throw new CustomError.CustomError(`Entity ${entity} not found in request`);
  }

  checkPermissions(req.user, req[entity].userId);

  next();
};

module.exports = authorizeEntity;
