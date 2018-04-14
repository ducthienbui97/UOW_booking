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
      })
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
    }
  }
};
