const passport = require("passport");
const configuredPassportLocalStrategy = require("../config/configurePassportLocalStrategy");
const User = require("../models/User");

const passportInit = () => {
  passport.use("local", configuredPassportLocalStrategy);

  passport.serializeUser(async function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false, {
          message: "You can't access that page before logon.",
        });
      }

      return done(null, user);
    } catch (e) {
      done(e);
    }
  });
};

module.exports = passportInit;
