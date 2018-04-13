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
var local = require("../config/local");

module.exports = passport => {
  /*Users*/
  router.get("/signup", user.get.signup);
  router.get("/login", user.get.login);
  router.get("/logout", user.get.logout);
  router.post("/signup", user.post.signup(passport));
  router.post("/login", user.post.login(passport));

  /*Events*/
  router.get("/", event.get.all);
  router.all("/event/:id*", event.getEvent);
  router.get("/event/:id", event.get.single);
  router.all("/event*", auth.ensureLoggedIn());
  router.all("/event/:id/*", event.authorizationCheck);
  router.get("/event/new", event.get.create);
  router.get("/event", event.get.ofUser);
  router.get("/event/:id/edit", event.get.edit);
  router.post("/event*", upload.single("image"), event.imageUploader);
  router.post("/event", event.post.create);
  router.post("/event/:id/edit", event.post.edit);

  /*Promotions*/
  router.get("/event/:id/promotion/new", promotion.get.new);
  router.get("/event/:id/promotion", promotion.get.list);
  router.post("/event/:id/promotion", promotion.post.new);

  /*Transactions*/
  router.all("/booking*", auth.ensureLoggedIn());
  router.get("/booking/:id", event.getEvent, transaction.get.booking);
  router.get("/booking", local.setCurrentPage("booking"), transaction.get.list);
  router.post("/booking", transaction.post.booking);

  /*Search*/
  router.get("/search", search.get);

  return router;
};
