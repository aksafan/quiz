const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

function setMongoDBStore() {
  const url = process.env.MONGO_DB_CONNECTING_STRING;
  const store = new MongoDBStore({
    uri: url,
    collection: "mySessions",
  });
  store.on("error", function (error) {
    console.log(error);
  });

  return store;
}

const configureSessionParams = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: setMongoDBStore(),
  cookie: { secure: false, sameSite: "strict" },
};

module.exports = configureSessionParams;
