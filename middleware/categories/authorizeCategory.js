const { checkPermissions } = require("../../utils");

const authorizeCategory = (req, res, next) => {
  checkPermissions(req.user, req.category.userId);

  next();
};

module.exports = authorizeCategory;
