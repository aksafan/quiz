const parseValidationErrors = (e, req) => {
  const keys = Object.keys(e.errors);
  keys.forEach((key) => {
    req.flash("error", key + ": " + e.errors[key].properties.message);
  });
};

const parseDuplicationErrors = (e, req) => {
  const errorMessage = `Duplicate value entered for ${Object.keys(e.keyValue)} field, please choose another value`;
  req.flash("error", Object.keys(e.keyValue) + ": " + errorMessage);
};

module.exports = { parseValidationErrors, parseDuplicationErrors };
