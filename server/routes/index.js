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
var stats = require("../controllers/statistic");
var utilities = require("../config/utilities");
module.exports = passport => {
  /*Users*/
  router.get("/signup", user.get.signup);
  router.get("/login", user.get.login);
  router.get("/logout", user.get.logout);
  router.post("/signup", user.post.signup(passport));
  router.post("/login", user.post.login(passport));
  router.all("/user*", auth.ensureLoggedIn());
  router.get("/user", user.get.user);
  router.get("/user/changePass", user.get.changePass);
  router.post("/user/edit", user.post.edit);
  router.post("/user/changePass", user.post.changePass);

  /*Events*/
  router.get("/", event.get.all);
  router.all("/event/:id*", utilities.getEvent);
  router.post("/event/:id*", utilities.checkCancelledEvent);
  router.get("/event/:id", event.get.single);
  router.all("/event*", auth.ensureLoggedIn());
  router.all("/event/:id/*", utilities.eventAuthorizationCheck);
  router.get("/event", event.get.ofUser);
  router.get("/event/:id/edit", event.get.edit);
  router.post("/event*", upload.single("image"), utilities.imageUploader);
  router.post("/event", event.post.create);
  router.post("/event/:id/edit", event.post.edit);
  router.post("/event/:id/cancel", event.post.cancel);
  router.post("/event/:id/approve", utilities.adminCheck, event.post.approve);
  router.get("/new/event", auth.ensureLoggedIn(), event.get.create);
  router.get("/event/:id/transactions", event.get.transactions);
  router.get("/event/:id/attendance", event.get.attendance);
  router.get(
    "/waiting/event",
    auth.ensureLoggedIn(),
    utilities.adminCheck,
    event.get.waiting
  );

  /*Promotions*/
  router.get("/event/:id/promotion/new", promotion.get.new);
  router.get("/event/:id/promotion", promotion.get.list);
  router.post("/event/:id/promotion", promotion.post.new);
  router.post("/event/:id/promotion/edit", promotion.post.edit);

  /*Transactions*/
  router.all("/booking*", auth.ensureLoggedIn());
  router.all("/booking/:id*", utilities.getEvent);
  router.all("/booking/:id/transaction/:transId*", utilities.getTransaction);
  router.get("/booking/:id", transaction.get.booking);
  router.get("/booking", transaction.get.list);
  router.get("/booking/:id/transaction/:transId", transaction.get.single);
  router.post("/booking/:id", transaction.post.booking);
  router.post(
    "/booking/:id/transaction/:transId*",
    utilities.transactionAuthorizationCheck,
    utilities.checkCancelledTransaction
  );
  router.post("/booking/:id/transaction/:transId/edit", transaction.post.edit);
  router.post(
    "/booking/:id/transaction/:transId/cancel",
    transaction.post.cancel
  );

  /*Search*/
  router.get("/search", search.get);
  /*Statistic*/
  router.get(
    "/statistic",
    auth.ensureLoggedIn(),
    utilities.adminCheck,
    stats.get
  );
  return router;
  1;
};
