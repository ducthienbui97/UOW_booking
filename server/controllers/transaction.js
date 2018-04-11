var models = require('../models');

module.exports = {
    get:{
        booking: (req,res,next) =>{
            models.Event.findById(req.params.id).then(event =>{
                if(!event){
                    var err = new Error('Event Not Found');
                    err.status = 404;
                    next(err);
                }
                else{
                    var tickets = req.query.count|1;
                    res.render('transaction/new',{
                        event: event.get({plain:true}),
                        tickets,
                    })
                }
            })
        },
        list: (req,res,next) =>{
            req.user.getBookedEvents({order: models.sequelize.col('start_time')}).then(events => {
                res.render('transaction/list',{
                    events:events.map(event => event.get({plain:true})),
                    title: "Booked events"
                });
            })
        }
    },
    post:{
        booking: (req,res,next) =>{
            req.user.addBookedEvent(req.body.id,{
                through:{
                    quantity:req.body.quantity
                }
            }).then(() =>{
                res.redirect('/booking');
            })
        }

    }
}