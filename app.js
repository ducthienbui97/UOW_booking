require("dotenv").config();
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var passport = require("./server/config/passport");
var session = require("express-session");
var routes = require("./server/routes");
var utilities = require("./server/config/utilities.js");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "server", "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public','images' ,'favicon.png')));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "bower_components")));

//passport
app.use(
  session({ secret: "UOW booking", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// add utilities values
app.use(utilities.getPublicKey);
app.use(utilities.getUser);
app.use(utilities.emptyStringToNull);
app.use(utilities.getError);
app.use(utilities.getSuccess);
// routes
app.use("/", routes(passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
