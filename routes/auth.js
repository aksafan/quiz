const express = require("express");
const passport = require("passport");
const router = express.Router();
const csrf = require("host-csrf");

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/auth");

router.route("/register").get(registerShow).post(registerDo);
router
  .route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/auth/logon",
      failureFlash: true,
    }),
    // successRedirect override to add csrf token refreshing
    (req, res) => {
      csrf.refresh(req, res);

      res.redirect("/");
    },
  );
router.route("/logoff").post(logoff);

module.exports = router;
