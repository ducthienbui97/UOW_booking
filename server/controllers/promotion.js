var models = require("../models");

module.exports = {
  get: {
    new: (req, res, next) =>
      res.render("promotion/new", { event: req.event.get({ plain: true }) }),
    list: async (req, res, next) => {
      var promotions = await event.getPromotions({ order: expire });
      res.render("promotion/list", {
        event: event.get({ plain: true }),
        promotions: promotions.map(promo => promo.get({ plain: true }))
      });
    }
  },
  post: {
    new: (req, res, next) => {
      models.Promotion.findOrCreate({
        where: {
          eventId: req.event.id,
          code: req.body.code
        },
        defaults: {
          isPercentage: req.body.isPercentage,
          amount: req.body.isPercentage
            ? Math.min(100, req.body.amount)
            : req.body.amount
        }
      }).spread((promotion, created) => {
        if (!created)
          res.render("/event/" + req.event.id + "/promotion/new", {
            error: {
              message: "Promotion code " + req.body.code + " is already taken"
            }
          });
        else res.redirect("/event/" + req.event.id + "/promotion");
      });
    }
  }
};
