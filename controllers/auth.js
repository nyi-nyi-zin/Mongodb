const User = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

//Render Register Page
exports.getRegisterPage = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    errorMsg: req.flash("error"),
  });
};

//Handle register page
exports.registerAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      req.flash("error", "Email is already exist");
      return res.redirect("/register");
    }
    return bcrypt
      .hash(password, 10)
      .then((hashedpassword) => {
        return User.create({ email, password: hashedpassword }).then((_) => {
          res.redirect("/login");
          transporter.sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Register Successful",
            html: "<h1>Register Account successful.</h1><p>Created Account using this email</p>",
          });
        });
      })
      .catch((err) => console.log(err));
  });
};

//Render Login Page
exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login", errorMsg: req.flash("error") });
};

//Handle Login
exports.postLoginData = (req, res) => {
  const { email, password } = req.body;
  User.findOne({
    email,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Check your information and Try again");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.isLogin = true;
            req.session.userInfo = user;
            return req.session.save((err) => {
              res.redirect("/");
              console.log(err);
            });
          }
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

  // res.redirect("/");
};

//Handle Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
