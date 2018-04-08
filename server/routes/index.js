var express = require("express");
var multer  = require("multer");
var upload = multer({storage:multer.memoryStorage()});
var router = express.Router();
var auth = require("connect-ensure-login");
var user = require("../controllers/user.js");
var event = require("../controllers/event.js");
var transaction = require("../controllers/transaction");
module.exports = (passport) => {
    /*Users*/
    router.get("/signup", user.get.signup);
    router.get("/login", user.get.login);
    router.get("/logout", user.get.logout);
    router.post("/signup", user.post.signup(passport));
    router.post("/login", user.post.login(passport));

    /*Events*/
    router.get("/",event.get.all(1));
    router.get("/event/new", auth.ensureLoggedIn(), event.get.create);
    router.get("/event", auth.ensureLoggedIn(), event.get.ofUser(1));
    router.get("/event/:id", event.get.single);
    router.post("/event", auth.ensureLoggedIn(),upload.single('image'), event.post.create);

    /*Transactions*/
    router.get("/booking/:id",auth.ensureLoggedIn(),transaction.get.booking);
    router.get("/booking",auth.ensureLoggedIn(),transaction.get.list);
    router.post("/booking",auth.ensureLoggedIn(),transaction.post.booking);
    return router
}