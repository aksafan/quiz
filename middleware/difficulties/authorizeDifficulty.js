const { checkPermissions } = require("../../utils");

const authorizeDifficulty = (req, res, next) => {
  checkPermissions(req.user, req.difficulty.userId);

  next();
};

module.exports = authorizeDifficulty;
