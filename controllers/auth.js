const User = require("../models/user");
const bcrypt = require("bcrypt");

//Render Register Page
exports.getRegisterPage = (req, res) => {
  res.render("auth/register", {
    title: "Register",
  });
};

//Handle register page
exports.registerAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.redirect("/register");
    }
    return bcrypt
      .hash(password, 10)
      .then((hashedpassword) => {
        return User.create({ email, password: hashedpassword }).then((_) => {
          res.redirect("/login");
        });
      })
      .catch((err) => console.log(err));
  });
};

//Render Login Page
exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

//Handle Login
exports.postLoginData = (req, res) => {
  const { email, password } = req.body;
  User.findOne({
    email,
  })
    .then((user) => {
      if (!user) {
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
