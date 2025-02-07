const User = require("../models/User");

const authMiddleware = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You can't access that page before logon.");
    res.redirect("/");
  } else {
    next();
  }
};

const RBACMiddleware = async (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You can't access that page before logon.");
    res.redirect("/");

    return next();
  }

  const user = await User.findById(req.user.id);
  if (!user || user.role !== "admin") {
    req.flash("error", "Access denied. Admins only.");
    res.redirect("/");
  }

  next();
};

module.exports = { authMiddleware, RBACMiddleware };
