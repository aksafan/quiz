const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../models/User");

const configuredPassportLocalStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "Incorrect credentials." });
      }

      const result = await user.comparePassword(password);
      if (result) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect credentials." });
      }
    } catch (e) {
      return done(e);
    }
  },
);

module.exports = configuredPassportLocalStrategy;
