var models = require("../models");

module.exports = {
  get: {
    booking: (req, res, next) => {
      var tickets = req.query.count ? req.query.count : 1;
      return res.render("transaction/new", {
        event: req.event.get({ plain: true }),
        tickets
      });
    },
    list: (req, res, next) => {
      models.Event.findAll({
        include: [
          {
            model: models.Transaction,
            where: { userId: req.user.id },
            include: [{ model: models.Ticket }]
          }
        ]
      }).then(events => {
        return res.render("transaction/list", {
          events: events.map(event => event.get({ plain: true }))
        });
      });
    }
  },
  post: {
    booking: async (req, res, next) => {
      var promotion = null;
      var total = req.event.price * req.body.quantity;
      var discount = 0;
      var booked = await models.Transaction.sum("quantity", {
        where: { eventId: req.event.id, userId: req.user.id }
      });
      var occupied = await models.Transaction.sum("quantity", {
        where: { eventId: req.event.id }
      });
      var allowed = Math.min(
        req.event.max - booked,
        req.event.capacity - occupied
      );
      if (req.body.quantity > allowed) {
        var creator = await req.event.getUser();
        return res.render("event/single", {
          event: req.event.get({ plain: true }),
          creator: creator.get({ plain: true }),
          error: { message: "You are only able to get " + allowed + " tickets" }
        });
      }
      var transaction = await models.Transaction.build({
        userId: req.user.id,
        eventId: req.event.id,
        quantity: req.body.quantity,
        total
      });
      if (req.body.promotionCode) {
        promotion = await models.Promotion.findOne({
          where: { code: req.body.promotionCode, eventId: req.event.id }
        });
        if (!promotion)
          return res.render("transaction/new", {
            event: req.event.get({ plain: true }),
            tickets: req.body.quantity,
            error: { message: "Promotion code not found!" }
          });
        else if (total < promotion.minSpend)
          return res.render("transaction/new", {
            event: req.event.get({ plain: true }),
            tickets: req.body.quantity,
            error: {
              message:
                "Min spend of " + promotion.code + " is " + promotion.minSpend
            }
          });
        else {
          if (promotion.isPercentage)
            transaction.discounted = total * (100 - promotion.amount);
          else transaction.discounted = total - promotion.amount;
          transaction.promotionCode = req.body.promotionCode;
        }
      }
      transaction = await transaction.save();
      await Promise.all(
        req.body.tickets.map(event => transaction.createTicket(event))
      );
      res.redirect("/booking");
    }
  }
};
