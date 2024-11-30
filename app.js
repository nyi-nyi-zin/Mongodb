const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", "views");

const { mongodbConnector } = require("./utils/database");

const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/post", (req, res, next) => {
  console.log("i am post middleware");
  next();
});

app.use((req, res, next) => {
  console.log("i am parent middleware");
  next();
});

app.use("/admin", adminRoutes);
app.use(postRoutes);

// mongoose
//   .connect(process.env.MONGODB_URL)
//   .then((result) => {

//     console.log("connected to server");
//   })
//   .catch((err) => console.log(err));

mongodbConnector();

app.listen(8080);
