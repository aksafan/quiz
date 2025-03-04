const ROLES = require("./../constants/roles");

const setLocals = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
    res.locals.user.isAdmin = req.user.role === ROLES.ADMIN;
  } else {
    res.locals.user = null;
  }
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");

  next();
};

module.exports = setLocals;
