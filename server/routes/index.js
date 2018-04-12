var express = require("express");
var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });
var router = express.Router();
var auth = require("connect-ensure-login");
var user = require("../controllers/user");
var event = require("../controllers/event");
var transaction = require("../controllers/transaction");
var search = require("../controllers/search");
var promotion = require("../controllers/promotion");

module.exports = passport => {
  /*Users*/
  router.get("/signup", user.get.signup);
  router.get(
    "/login",
    (req, res, next) => {
      res.locals.currentPage = "login";
      res.locals.title = "Login";
      next();
    },
    user.get.login
  );
  router.get("/logout", user.get.logout);
  router.post(
    "/signup",
    (req, res, next) => {
      res.locals.currentPage = "signup";
      res.locals.title = "Signup";
      next();
    },
    user.post.signup(passport)
  );
  router.post("/login", user.post.login(passport));

  /*Events*/
  router.get(
    "/",
    (req, res, next) => {
      res.locals.currentPage = "home";
      next();
    },
    event.get.all
  );
  router.get(
    "/event/new",
    auth.ensureLoggedIn(),
    (req, res, next) => {
      res.locals.currentPage = "new-event";
      next();
    },
    event.get.create
  );
  router.get(
    "/event",
    auth.ensureLoggedIn(),
    (req, res, next) => {
      res.locals.currentPage = "event";
      next();
    },
    event.get.ofUser
  );
  router.get("/event/:id", event.get.single);
  router.get("/event/:id/edit", auth.ensureLoggedIn(), event.get.edit);
  router.post(
    "/event",
    auth.ensureLoggedIn(),
    upload.single("image"),
    event.post.create
  );
  router.post(
    "/event/edit",
    auth.ensureLoggedIn(),
    upload.single("image"),
    event.post.edit
  );

  /*Promotions*/
  router.get(
    "/event/:id/promotion/new",
    auth.ensureLoggedIn(),
    promotion.get.new
  );
  router.get("/event/:id/promotion", auth.ensureLoggedIn(), promotion.get.list);
  router.post(
    "/event/:id/promotion",
    auth.ensureLoggedIn(),
    promotion.post.new
  );

  /*Transactions*/
  router.get("/booking/:id", auth.ensureLoggedIn(), transaction.get.booking);
  router.get(
    "/booking",
    auth.ensureLoggedIn(),
    (req, res, next) => {
      res.locals.currentPage = "booking";
      next();
    },
    transaction.get.list
  );
  router.post("/booking", auth.ensureLoggedIn(), transaction.post.booking);

  /*Search*/
  router.get("/search", search.get);

  return router;
};
