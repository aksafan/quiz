// Module dependencies
const express = require("express");
require("express-async-errors");
// session persistence
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
const cookieParser = require("cookie-parser");
// auth
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const authenticate = require("./middleware/authentication");
const authorize = require("./middleware/authorization");
// routers
const questionsRouter = require("./routes/questions");
const authRouter = require("./routes/auth");
// error handlers
const notFoundErrorHandler = require("./middleware/errors/notFound");
const internalServerErrorErrorHandler = require("./middleware/errors/internalServerError");
// extra security packages
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const csrf = require("./middleware/csrf");
// DB
const connectDB = require("./db/connect");

const app = express();

// config
app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(require("connect-flash")());

// session-persisted message middleware
const url = process.env.MONGO_DB_CONNECTING_STRING;
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};
app.use(session(sessionParms));

// csrf-protection middleware
let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}
app.use(csrf(csrf_development_mode));

// extra security middlewares
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);
app.use(helmet());
app.use(xss());

// auth
passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(require("./middleware/setLocals"));

// routes
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/auth", authRouter);
const { ADMIN } = require("./constants/roles");
app.use("/admin/questions", [authenticate, authorize(ADMIN)], questionsRouter);

// error handler middlewares
app.use(internalServerErrorErrorHandler);
app.use(notFoundErrorHandler);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_DB_CONNECTING_STRING);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
