var models = require("../models");

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
      try {
        var events = await models.Event.findAll({
          where: {
            start_time: {
              [models.sequelize.Op.gt]: models.sequelize.literal(
                "CURRENT_TIMESTAMP"
              )
            },
            cancelled: false
          },
          order: models.sequelize.col("start_time")
        });
        res.render("event/all", {
          title: "Home",
          currentPage: "home",
          events: events.map(event => event.get({ plain: true }))
        });
      } catch (e) {
        next(e);
      }
    },
    ofUser: async (req, res, next) => {
      try {
        var events = await req.user.getEvents({
          where: {
            start_time: {
              [models.sequelize.Op.gt]: models.sequelize.literal(
                "CURRENT_TIMESTAMP"
              )
            }
          },
          order: models.sequelize.col("start_time")
        });
        res.render("event/all", {
          title: "Created events:",
          currentPage: "event",
          events: events.map(event => event.get({ plain: true }))
        });
      } catch (e) {
        next(e);
      }
    },
    single: async (req, res, next) => {
      try {
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
          occupied: req.eventData.occupied
        });
      } catch (e) {
        next(e);
      }
    },
    transactions: async (req, res, next) => {
      try {
        var transactions = await req.event.getTransactions({
          order: models.sequelize.col("createdAt")
        });
        var fund =
          req.eventData.occupied * req.event.price -
          req.eventData.totalDiscount;
        res.render("event/transactions", {
          event: req.event.get({ plain: true }),
          transactions: transactions.map(transaction =>
            transaction.get({ plain: true })
          ),
          fund,
          total: req.eventData.occupied,
          max: req.event.capacity
        });
      } catch (e) {
        next(e);
      }
    },
    attendance: (req, res, next) => {
      req.event
        .getTransactions({
          where: { cancelled: false },
          include: [{ model: models.Ticket }]
        })
        .then(transactions => {
          res.render("event/attend", {
            event: req.event.get({ plain: true }),
            transactions: transactions.map(transaction =>
              transaction.get({ plain: true })
            )
          });
        })
        .catch(e => next(e));
    }
  },
  post: {
    create: (req, res, next) => {
      req.user
        .createEvent(req.body)
        .then(() => res.redirect("/"))
        .catch(e => next(e));
    },
    edit: async (req, res, next) => {
      try {
        await req.event.update(req.body);
        res.redirect("/event/" + req.event.id);
      } catch (e) {
        next(e);
      }
    },
    cancel: async (req, res, next) => {
      try {
        await req.event.update({ cancelled: true });
        await models.Transaction.update(
          { cancelled: true },
          { where: { eventId: req.event.id } }
        );
        res.redirect("/event/" + req.event.id);
      } catch (e) {
        next(e);
      }
    }
  }
};
