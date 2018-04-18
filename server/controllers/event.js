var models = require("../models");
const limit = 50;

module.exports = {
  get: {
    edit: (req, res) => {
      res.render("event/edit", {
        title: req.event.name,
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
          },
          cancelled:false
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
      var events = await req.user.getEvents({
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
      var allowed = Math.min(
        req.event.max - req.eventData.booked,
        req.event.capacity - req.eventData.occupied
      );
      // console.log(req.eventData.booked);
      // console.log(req.eventData.occupied);
      // console.log(allowed)
      res.render("event/single", {
        event: req.event.get({ plain: true }),
        creator: creator.get({ plain: true }),
        allowed,
        occupied:req.eventData.occupied
      });
    },
    transactions: async (req, res, next) => {
      var transactions = await req.event.getTransactions({order:models.sequelize.col('createdAt')});
      var fund = req.eventData.occupied*req.event.price - req.eventData.totalDiscount;
      res.render("event/transactions", {
        transactions: transactions.map(transaction => transaction.get({plain:true})),
        fund,
        total: req.eventData.occupied,
        max: req.event.capacity,
      });
    }
  },
  post: {
    create: (req, res) => {
      req.user.createEvent(req.body).then(() => res.redirect("/"));
    },
    edit: async (req, res, next) => {
      await req.event.update(req.body);
      res.redirect("/event/" + req.event.id);
    },
    cancel: async (req, res, next) => {
      await req.event.update({ cancelled: true });
      await models.Transaction.update(
        { cancelled: true },
        { where: { eventId: req.event.id } }
      );
      res.redirect("/event/" + req.event.id);
    }
  }
};
