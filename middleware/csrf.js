const csrf = require("host-csrf");

const csrfMiddleware = (csrf_development_mode) => {
  return csrf({
    protected_operations: ["PATCH"],
    protected_content_types: ["application/json"],
    development_mode: csrf_development_mode,
  });
};

module.exports = csrfMiddleware;
