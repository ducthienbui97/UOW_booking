var models = require('../models');

module.exports = {
    get:{
        booking: (req,res,next) =>{
            models.Event.findById(req.query.id).then(event =>{
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
        }
    },
    post:{
        booking: (req,res,next) =>{
            req.user.addBookedEvent(req.body.id,{
                through:{
                    quantity:req.body.quantity,
                    tickets:[
                        {name:'Thien'}
                    ]
                }
            }).then(() =>{
                res.redirect('/');
            })
        }

    }
}