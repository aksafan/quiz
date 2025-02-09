const authorize = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash("error", "Unauthorized to access this route");
      res.redirect("/");
    }

    next();
  };
};

module.exports = authorize;
