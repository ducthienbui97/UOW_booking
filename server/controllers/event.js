var models = require("../models");
var axios = require("axios");
const limit = 50;
const imgurHeaders = {
  Authorization: "Client-ID " + process.env.IMGUR
};

module.exports = {
  getEvent: async (req, res, next) => {
    req.event = await models.Event.findById(req.params.id);
    if (!req.event) {
      var err = new Error("Event Not Found");
      err.status = 404;
      next(err);
    } else next();
  },
  authorizationCheck: (req, res, next) => {
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
  get: {
    edit: (req, res) => {
      res.render("event/edit", {
        title: event.name,
        event: req.event.get({ plain: true })
      });
    },
    create: (req, res) =>
      res.render("event/create", {
        title: "New Event",
        currentPage: "new-event"
      }),
    all: async (req, res, next) => {
      var pages = req.query.pages ? req.query.pages : 1;
      var offset = (pages - 1) * limit;
      var events = await models.Event.findAll({
        where: {
          start_time: {
            [models.sequelize.Op.gt]: models.sequelize.literal(
              "CURRENT_TIMESTAMP"
            )
          }
        },
        offset,
        limit,
        order: models.sequelize.col("start_time")
      });
      res.render("event/all", {
        title: "Home",
        currentPage: "home",
        events: events.map(event => event.get({ plain: true }))
      });
    },
    ofUser: async (req, res, next) => {
      var pages = req.query.pages ? req.query.pages : 1;
      var offset = (pages - 1) * limit;
      var events = req.user.getEvents({
        where: {
          start_time: {
            [models.sequelize.Op.gt]: models.sequelize.literal(
              "CURRENT_TIMESTAMP"
            )
          }
        },
        offset,
        limit,
        order: models.sequelize.col("start_time")
      });
      res.render("event/all", {
        title: "Created events:",
        currentPage: "event",
        events: events.map(event => event.get({ plain: true }))
      });
    },
    single: async (req, res, next) => {
      var creator = await req.event.getUser();
      res.render("event/single", {
        event: req.event.get({ plain: true }),
        creator: creator.get({ plain: true })
      });
    }
  },
  post: {
    create: (req, res) => {
      req.user.createEvent(req.body);
      res.redirect("/");
    },
    edit: async (req, res, next) => {
      await req.event.update(req.body);
      res.redirect("/event/" + req.event.id);
    }
  }
};
