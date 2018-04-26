var models = require("../models");

module.exports = {
  get: {
    new: (req, res, next) =>
      res.render("promotion/new", { event: req.event.get({ plain: true }) }),
    list: async (req, res, next) => {
      try {
        var promotions = await req.event.getPromotions({
          order: models.sequelize.col("expire")
        });
        res.render("promotion/list", {
          event: req.event.get({ plain: true }),
          promotions: promotions.map(promo => promo.get({ plain: true }))
        });
      } catch (e) {
        next(e);
      }
    }
  },
  post: {
    new: (req, res, next) => {
      try {
        // console.log(req.body);
        models.Promotion.findOrCreate({
          where: {
            eventId: req.event.id,
            code: req.body.code
          },
          defaults: {
            isPercentage: req.body.isPercentage,
            amount: req.body.amount,
            minSpend: req.body.minSpend,
            expire: req.body.expire
          }
        }).spread((promotion, created) => {
          if (!created) {
            req.session.error = {
              message: "Promotion code " + req.body.code + " is already taken"
            };
            res.redirect("/event/" + req.event.id + "/promotion/new");
          } else res.redirect("/event/" + req.event.id + "/promotion");
        });
      } catch (e) {
        next(e);
      }
    },
    edit: (req, res, next) => {
      try {
        req.body.eventId = req.event.id;
        models.Promotion.update(req.body, { where: { id: req.body.id } });
        res.redirect("/event/" + req.event.id + "/promotion");
      } catch (e) {
        next(e);
      }
    }
  }
};
