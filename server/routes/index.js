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
    router.get("/login",(req,res,next) =>{
        res.locals.currentPage = "login";
        res.locals.title = "Login";
        next()
    }, user.get.login);
    router.get("/logout", user.get.logout);
    router.post("/signup",(req,res,next) =>{
        res.locals.currentPage = "signup";
        res.locals.title = "Signup";
        next()
    }, user.post.signup(passport));
    router.post("/login", user.post.login(passport));

    /*Events*/
    router.get("/",(req,res,next) => {
        res.locals.currentPage = "home";
        res.locals.title = "Home";
        next()
    }, event.get.all(1));
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