var models = require("../models");
var limit = 50;
var orders = ["start_time", "price"];
module.exports = {
  get: (req, res, next) => {
    var query = req.query.q ? req.query.q : '';
    var pages = req.query.pages ? req.query.pages : 1;
    var order = (orders.indexOf(order) >= 0) ? req.query.order : "start_time";
    var offset = (pages - 1) * limit;
    models.Event.findAll({
      where: {
        [models.sequelize.Op.or]: [
          { name: { like: "%" + query + "%" } },
          { description: { like: "%" + query + "%" } },
          { location: { like: "%" + query + "%" } }
        ]
      },
      offset,
      limit,
      order: models.sequelize.col(order)
    }).then(events => {
      res.render("event/all", {
        events: events.map(event => event.get({ plain: true })),
        title: query
      });
    });
  }
};
