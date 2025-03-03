const session = require("express-session");

const sessionMiddleware = (configureSessionParams) => {
  return session(configureSessionParams);
};

module.exports = sessionMiddleware;
