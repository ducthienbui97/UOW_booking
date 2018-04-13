var models = require("../models");

module.exports = {
  get: {
    booking: (req, res, next) => {
      models.Event.findById(req.params.id).then(event => {
        if (!event) {
          var err = new Error("Event Not Found");
          err.status = 404;
          next(err);
        } else {
          var tickets = req.query.count | 1;
          res.render("transaction/new", {
            event: event.get({ plain: true }),
            tickets
          });
        }
      });
    },
    list: (req, res, next) => {
      req.user
        .getBookedEvents({ order: models.sequelize.col("start_time") })
        .then(events => {
          res.render("transaction/list", {
            events: events.map(event => event.get({ plain: true })),
            title: "Booked events"
          });
        });
    }
  },
  post: {
    booking: async (req, res, next) => {
      var event = await models.Event.findById(req.body.id);
      var promotion = null;
      if (req.body.promotionCode)
        promotion = await models.Promotion.findOne({
          where: { code: req.body.promotionCode }
        });

      await req.user.addBookedEvent(event.get("id"), {
        through: {
          quantity: req.body.quantity,
          total: event.get("price") * req.body.quantity
        }
      });
      res.redirect("/booking");
    }
  }
};
