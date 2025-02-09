const authorize = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role) {
      req.flash("error", "Access denied. Admins only.");
      res.redirect("/");
    }

    next();
  };
};

module.exports = authorize;
