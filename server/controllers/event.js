var models = require("../models");
var axios = require("axios");
var limit = 50;
var imgurHeaders = {
  Authorization: "Client-ID " + process.env.IMGUR
};
module.exports = {
  get: {
    edit: (req, res) => {
      console.log(imgurHeaders);
      models.Event.findById(req.params.id).then(event => {
        if (event.userId == req.user.id) {
          //console.log(models.Event.prototype);
          res.render("event/edit", { event: event.get({ plain: true }) });
        } else {
          var error = new Error("Forbidden");
          error.status = 403;
          next(error);
        }
      });
    },
    create: (req, res) => res.render("event/create", { title: "New Event" }),
    all: (req, res, next) => {
      var pages = req.query.pages ? req.query.pages : 1;
      var offset = (pages - 1) * limit;
      models.Event.findAll({
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
      }).then(events => {
        res.render("event/all", {
          title: "Home",
          events: events.map(event => event.get({ plain: true }))
        });
      });
    },
    ofUser: (req, res, next) => {
      var pages = req.query.pages ? req.query.pages : 1;
      var offset = (pages - 1) * limit;
      req.user
        .getEvents({
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
        })
        .then(events => {
          res.render("event/all", {
            title: "Created events:",
            events: events.map(event => event.get({ plain: true }))
          });
        });
    },
    single: (req, res, next) => {
      models.Event.findById(req.params.id).then(event => {
        if (!event) {
          var err = new Error("Event Not Found");
          err.status = 404;
          next(err);
        }
        event.getUser().then(user =>
          res.render("event/single", {
            event: event.get({ plain: true }),
            creator: user.get({ plain: true })
          })
        );
      });
    }
  },
  post: {
    create: (req, res) => {
      var image = req.file.buffer.toString("base64");
      axios
        .post(
          "https://api.imgur.com/3/image",
          { image },
          { headers: imgurHeaders }
        )
        .then(response => {
          req.body.imageURL = response.data.data.link;
          req.user.createEvent(req.body);
          res.redirect("/");
        });
    },
    edit: (req, res, next) => {
      models.Event.findById(req.body.id).then(event => {
        console.log(event);
        if (!event) {
          var err = new Error("Not Found");
          err.status = 404;
          next(err);
        } else if (event.userId == req.user.id) {
          if (req.file) {
            var image = req.file.buffer.toString("base64");
            axios
              .post(
                "https://api.imgur.com/3/image",
                { image },
                { headers: imgurHeaders }
              )
              .then(response => {
                req.body.imageURL = response.data.data.link;
                event
                  .update(req.body)
                  .then(() => res.redirect("/event/" + event.id));
              });
          } else {
            event
              .update(req.body)
              .then(() => res.redirect("/event/" + event.id));
          }
        } else {
          var error = new Error("Forbidden");
          error.status = 403;
          next(error);
        }
      });
    }
  }
};
