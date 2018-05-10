var models = require("../models");
module.exports = {
  get: (req, res, next) => {
    var endDate, startDate;
    var count = 0,
      total = 0,
      quantity = 0,
      paid = 0;
    var where = {};
    var venue;
    try {
      startDate = new Date(
        req.query.startDate ? req.query.startDate : "2017-1-1"
      );
      endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
      venue = req.query.venture ? req.query.venture : "";
      where = {
        start_time: {
          [models.sequelize.Op.between]: [startDate, endDate]
        },
        approved: true,
        cancelled: false,
        location: { $iLike: "%" + venue + "%" }
      };
      models.Event.findAll({
        where,
        include: [
          {
            model: models.Transaction,
            where: { cancelled: false },
            required: false
          }
        ]
      }).then(events => {
        events.forEach(event => {
          event.Transactions.forEach(trans => {
            quantity += trans.quantity;
            paid += trans.total - trans.discounted;
          });
          count++;
          total += event.capacity;
        });
        res.render("statistics", {
          count,
          total,
          quantity,
          paid,
          venue,
          startDate: startDate.toISOString().substr(0, 10),
          endDate: endDate.toISOString().substr(0, 10)
        });
      });
    } catch (e) {
      next(e);
    }
  }
};
