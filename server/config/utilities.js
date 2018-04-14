var models = require("../models");
var axios = require("axios");
const imgurHeaders = {
  Authorization: "Client-ID " + process.env.IMGUR
};

function emptyStringToNull(object) {
  Object.keys(object).forEach(key => {
    if (object[key] === "") object[key] = null;
    else if (typeof object[key] === "object")
      object[key] = emptyStringToNull(object[key]);
  });
  return object;
}
module.exports = {
  getUser: (req, res, next) => {
    res.locals.user = req.user ? req.user.get({ plain: true }) : null;
    next();
  },
  getError: (req, res, next) => {
    res.locals.error = req.session.error;
    delete req.session.error;
    next();
  },
  getSuccess: (req, res, next) => {
    res.locals.success = req.session.success;
    delete req.session.success;
    next();
  },
  getEvent: async (req, res, next) => {
    req.event = await models.Event.findById(req.params.id);
    if (!req.event) {
      var err = new Error("Event Not Found");
      err.status = 404;
      next(err);
    } else next();
  },
  getTransaction: async (req, res, next) => {
    req.transaction = await models.Transaction.findOne({
      where: { id: req.params.transId },
      include: [{ model: models.Ticket }]
    });
    if (!req.transaction) {
      var err = new Error("Transaction Not Found");
      err.status = 404;
      next(err);
    } else next();
  },
  transactionAuthorizationCheck: (req, res, next) => {
    if (req.transaction.userId != req.user.id) {
      var error = new Error("Forbidden");
      error.status = 403;
      next(error);
    } else next();
  },
  eventAuthorizationCheck: (req, res, next) => {
    if (req.event.userId != req.user.id) {
      var error = new Error("Forbidden");
      error.status = 403;
      next(error);
    } else next();
  },
  imageUploader: async (req, res, next) => {
    if (req.file) {
      req.body.imageURL = (await axios.post(
        "https://api.imgur.com/3/image",
        { image: req.file.buffer.toString("base64") },
        { headers: imgurHeaders }
      )).data.data.link;
    }
    next();
  },
  emptyStringToNull: (req, res, next) => {
    req.body = emptyStringToNull(req.body);
    next();
  }
};
