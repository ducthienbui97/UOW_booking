var models = require("../models");
var stripe = require("stripe")(process.env.PRIVATE_KEY);
var getPromotion = async (req, errorWriter, promotionCode, total) => {
  var promotion = await models.Promotion.findOne({
    where: { code: promotionCode, eventId: req.event.id }
  });
  if (!promotion) {
    errorWriter.error = { message: "Promotion code not found!" };
    return null;
  }
  if (total < promotion.minSpend) {
    errorWriter.error = {
      message: "Min spend of " + promotion.code + " is " + promotion.minSpend
    };
    return null;
  }
  if (Date.now() > promotion.expire) {
    errorWriter.error = {
      message: "Promotion code expired"
    };
    return null;
  }

  return promotion;
};
module.exports = {
  get: {
    booking: async (req, res, next) => {
      try {
        var tickets = req.query.count ? req.query.count : 1;
        var promotion = null;
        var price = req.event.price;
        var total = price * tickets;
        var discount = 0;
        var code = "";
        var allowed = Math.min(
          req.event.max - req.eventData.booked,
          req.event.capacity - req.eventData.occupied
        );
        if (tickets > allowed) {
          req.session.error = {
            message: "You are only able to get " + allowed + " tickets"
          };
          return res.redirect("/event/" + req.event.id);
        }
        if (req.query.promotion) {
          promotion = await getPromotion(
            req,
            res.locals,
            req.query.promotion,
            total
          );
          if (promotion) {
            code = promotion.code;
            if (promotion.isPercentage) discount = total * promotion.amount / 100;
            else discount = promotion.amount;
            discount = Math.min(discount, total);
            res.locals.success = {
              message:
                "Saved " + discount + " using " + code + " promotion code"
            };
          }
        }
        return res.render("transaction/new", {
          event: req.event.get({ plain: true }),
          tickets,
          promotion,
          discount,
          total,
          price,
          code
        });
      } catch (e) {
        next(e);
      }
    },
    list: (req, res, next) => {
      var where = {};
      var transWhere = {userId: req.user.id}
      if (!req.query.showAll) {
        where = {
          start_time: {
            [models.sequelize.Op.gt]: models.sequelize.literal(
              "CURRENT_TIMESTAMP"
            )
          },
          cancelled: false
        };
        transWhere.cancelled = false
      }

      models.Event.findAll({
        include: [
          {
            model: models.Transaction,
            where: transWhere,
            include: [{ model: models.Ticket }]
          }
        ],
        where,
        order: models.sequelize.col("start_time")
      })
        .then(events => {
          return res.render("transaction/list", {
            events: events.map(event => event.get({ plain: true }))
          });
        })
        .catch(e => next(e));
    },
    single: (req, res) => {
      //console.log(req.transaction);
      try {
        res.render("transaction/single", {
          transaction: req.transaction.get({ plain: true })
        });
      }catch (e) {
        next(e)
      }
    }
  },
  post: {
    booking: async (req, res, next) => {
      try {
        var promotion = null;
        var total = req.event.price * req.body.quantity;
        var allowed = Math.min(
          req.event.max - req.eventData.booked,
          req.event.capacity - req.eventData.occupied
        );
        if (req.body.quantity > allowed) {
          req.session.error = {
            message: "You are only able to get " + allowed + " tickets"
          };
          return res.redirect("/event/" + req.event.id);
        }
        var transaction = await models.Transaction.build({
          userId: req.user.id,
          eventId: req.event.id,
          quantity: req.body.quantity,
          total
        });
        if (req.body.promotionCode) {
          promotion = await getPromotion(
            req,
            req.session,
            req.body.promotionCode,
            total
          );
          if (!promotion)
            return res.redirect(
              "/booking/" + req.event.id + "?count=" + req.body.quantity
            );
          if (promotion.isPercentage)
            transaction.discounted = total * promotion.amount / 100;
          else transaction.discounted = promotion.amount;
          transaction.discounted = Math.min(transaction.discounted, total);
          transaction.promotionCode = req.body.promotionCode;
        }
        if (transaction.discounted < transaction.total) {
          var charge = await stripe.charges.create({
            amount: Math.round(
              (transaction.total - transaction.discounted) * 100
            ),
            currency: "AUD",
            source: req.body.stripeToken
          });
          //console.log(charge);
          transaction.stripeId = charge.id;
        }
        transaction = await transaction.save();
        await Promise.all(
          req.body.tickets.map(event => transaction.createTicket(event))
        );
        res.redirect("/booking");
      } catch (e) {
        next(e);
      }
    },
    edit: async (req, res, next) => {
      try {
        await Promise.all(
          req.body.tickets.map(ticket => {
            models.Ticket.update(ticket, { where: { id: ticket.id } });
          })
        );
        res.redirect(
          "/booking/" + req.event.id + "/transaction/" + req.transaction.id
        );
      } catch (e) {
        next(e);
      }
    },
    cancel: async (req, res, next) => {
      try {
        await req.transaction.update({ cancelled: true });
        res.redirect(
          "/booking/" + req.event.id + "/transaction/" + req.transaction.id
        );
      } catch (e) {
        next(e);
      }
    }
  }
};
