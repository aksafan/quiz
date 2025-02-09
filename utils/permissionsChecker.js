const { ADMIN } = require("../constants/roles");
const { UnauthorizedError } = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === ADMIN) return;

  if (requestUser.id === resourceUserId.toString()) return;

  throw new UnauthorizedError("Not authorized to access this route");
};

module.exports = checkPermissions;
