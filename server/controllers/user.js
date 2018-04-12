module.exports = {
  get: {
    login: (req, res) => res.render("user/login"),
    logout: (req, res) => {
      req.logout();
      req.session.destroy(err => res.redirect("/"));
    },
    signup: (req, res) => res.render("user/signup")
  },
  post: {
    signup: passport => {
      return (req, res, next) => {
        passport.authenticate("signup", (err, user, info) => {
          if (err) next(err);
          else if (!user) res.render("user/signup", { error: info });
          else if (req.session.returnTo) res.redirect(req.session.returnTo);
          else
            res.render("user/login", {
              success: { message: "Successfully created account!" }
            });
        })(req, res, next);
      };
    },
    login: passport => {
      return (req, res, next) => {
        passport.authenticate("login", (err, user, info) => {
          if (err) next(err);
          else if (!user) res.render("user/login", { error: info });
          else
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
