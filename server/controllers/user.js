var models = require("../models");
var bCrypt = require("bcrypt-nodejs");

module.exports = {
  get: {
    login: (req, res) =>
      res.render("user/login", {
        currentPage: "login",
        title: "Login"
      }),
    logout: (req, res) => {
      req.logout();
      req.session.destroy(err => res.redirect("/"));
    },
    signup: (req, res) =>
      res.render("user/signup", {
        currentPage: "signup",
        title: "Signup"
      }),
    user: (req, res) => res.render("user/view"),
    changePass: (req, res) => res.render("user/changePass")
  },
  post: {
    signup: passport => {
      return (req, res, next) => {
        passport.authenticate("signup", (err, user, info) => {
          if (err) next(err);
          else if (!user) {
            req.session.error = info;
            res.redirect("/signup");
          } else if (req.session.returnTo) res.redirect(req.session.returnTo);
          else {
            req.session.success = { message: "Successfully created account!" };
            res.redirect("/login");
          }
        })(req, res, next);
      };
    },
    login: passport => {
      return (req, res, next) => {
        passport.authenticate("login", (err, user, info) => {
          if (err) next(err);
          else if (!user) {
            console.log(info);
            req.session.error = info;
            res.redirect("/login");
          } else
            req.login(user, err => {
              if (err) return next(err);
              if (req.session.returnTo) res.redirect(req.session.returnTo);
              else res.redirect("/");
            });
        })(req, res, next);
      };
    },
    changePass: async (req, res, next) => {
      try {
        await req.user.update({ password: bCrypt.hashSync(req.body.password) });
        res.redirect("/user");
      } catch (e) {
        next(e);
      }
    },
    edit: async (req, res, next) => {
      try {
        await req.user.update({
          name: req.body.name,
          studentNo: req.body.studentNo
        });
        res.redirect("/user");
      } catch (e) {
        next(e);
      }
    }
  }
};
