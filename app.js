const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);

app.set("view engine", "ejs");
app.set("views", "views");

const User = require("./models/user");

const store = new mongoStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/authen");

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

app.use("/admin", adminRoutes);
app.use(postRoutes);
app.use(authRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    app.listen(8080);
    console.log("connected to server");
  })
  .catch((err) => console.log(err));
