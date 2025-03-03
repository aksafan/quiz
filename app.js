// Module dependencies
const express = require("express");
require("express-async-errors");
require("dotenv").config();
// session persistence
const sessionParms = require("./config/configureSessionParams");
const sessionMiddleware = require("./middleware/session")(sessionParms);
const cookieParser = require("cookie-parser");
// auth
const passport = require("passport");
const passportInit = require("./services/passportInit");
const authenticate = require("./middleware/auth/authentication");
const authorize = require("./middleware/auth/authorization");
// routers
const questionsRouter = require("./routes/questions");
const categoriesRouter = require("./routes/categories");
const authRouter = require("./routes/auth");
// error handlers
const notFoundErrorHandler = require("./middleware/errors/notFound");
const errorHandlerMiddleware = require("./middleware/errors/errorHandler");
// extra security packages
const configureRateLimiter = require("./config/configureRateLimiter");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const csrf = require("./middleware/csrf");
const mongoSanitize = require("express-mongo-sanitize");
// DB
const connectDB = require("./db/connection");

const app = express();

// config
app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(require("connect-flash")());
app.use(express.static("./public"));

app.use(sessionMiddleware);

// csrf-protection middleware
let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}
app.use(csrf(csrf_development_mode));

// extra security middlewares
app.use(rateLimiter(configureRateLimiter));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

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
const { ADMIN, USER } = require("./constants/roles");
app.use(
  "/admin/questions",
  [authenticate, authorize(ADMIN, USER)],
  questionsRouter,
);
app.use(
  "/admin/categories",
  [authenticate, authorize(ADMIN)],
  categoriesRouter,
);

// error handler middlewares
app.use(notFoundErrorHandler);
app.use(errorHandlerMiddleware);

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
