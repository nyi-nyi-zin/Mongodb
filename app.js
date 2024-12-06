//Import packages
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

//Configure view engine
app.set("view engine", "ejs");
app.set("views", "views");

//Import Schema
const User = require("./models/user");

const errorController = require("./controllers/error");

//Import middlewares
const { isLogin } = require("./middleware/is-login");

//Database setup
const store = new mongoStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

//Import routes
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/authen");

//Configure others necessary things
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

//Register third party packages
const csrfProtect = csrf();
app.use(flash());
app.use(csrfProtect);

//Middleware
app.use((req, res, next) => {
  if (req.session.isLogin === undefined) {
    return next();
  }
  User.findById(req.session.userInfo._id)
    .select("_id email")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//Middleware
app.use((req, res, next) => {
  res.locals.isLogin = req.session.isLogin ? true : false;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//Register routes
app.use("/admin", isLogin, adminRoutes);
app.use(postRoutes);
app.use(authRoutes);
app.use(errorController.get500Page);

app.all("*", errorController.get404Page);

//Connect to data base and host server
mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    app.listen(8080);
    console.log("connected to server");
  })
  .catch((err) => console.log(err));
