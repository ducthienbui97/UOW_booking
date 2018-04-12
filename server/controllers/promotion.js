var models = require("../models");

module.exports = {
  get: {
    new: (req, res, next) => {
      models.Event.findById(req.params.id).then(event => {
        if (event.userId == req.user.id)
          res.render("promotion/new", { event: event.get({ plain: true }) });
        else {
          var error = new Error("Forbidden");
          error.status = 403;
          next(error);
        }
      });
    },
    list: (req, res, next) => {
      models.Event.findById(req.params.id).then(event => {
        if (event.userId == req.user.id) {
          //console.log(models.Event.prototype);
          event.getPromotions().then(promotions => {
            res.render("promotion/list", {
              event: event.get({ plain: true }),
              promotions: promotions.map(promo => promo.get({ plain: true }))
            });
          });
        } else {
          var error = new Error("Forbidden");
          error.status = 403;
          next(error);
        }
      });
    }
  },
  post: {
    new: (req, res, next) => {
      models.Event.findById(req.params.id).then(event => {
        if (event.userId == req.user.id) {
          models.Promotion.findOrCreate({
            where: {
              eventId: event.id,
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
              return res.render("promotion/new", {
                error: {
                  message:
                    "Promotion code " + req.body.code + " is already taken"
                }
              });
            else res.redirect("/event/" + req.params.id + "/promotion");
          });
        } else {
          var error = new Error("Forbidden");
          error.status = 403;
          next(error);
        }
      });
    }
  }
};
