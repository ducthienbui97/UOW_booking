var models = require("../models");
var orders = ["start_time", "price"];
module.exports = {
  get: (req, res, next) => {
    try {
      var query = req.query.q ? req.query.q : "";
      var order = orders.indexOf(order) >= 0 ? req.query.order : "start_time";
      query = query.split(/[^A-Za-z1-9]+/).join("%");
      models.Event.findAll({
        where: {
          [models.sequelize.Op.or]: [
            { name: { $iLike: "%" + query + "%" } },
            { description: { $iLike: "%" + query + "%" } },
            { location: { $iLike: "%" + query + "%" } }
          ]
        },
        order: models.sequelize.col(order)
      }).then(events => {
        res.render("event/all", {
          events: events.map(event => event.get({ plain: true })),
          title: query
        });
      });
    } catch (e) {
      next(e);
    }
  }
};
