const { checkPermissions } = require("../../utils");

const authorizeQuestion = (req, res, next) => {
  checkPermissions(req.user, req.question.userId);

  next();
};

module.exports = authorizeQuestion;
