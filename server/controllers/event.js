var models = require('../models');
var axios = require('axios');
var limit = 50;
module.exports = {
    get:{
        create: (req,res) => res.render('event/create'),
        all: (pages) =>{
            var offset = (pages - 1)*limit;
            return (req,res) => {
                models.Event.findAll({
                    where: {
                        time: {
                            [models.sequelize.Op.gt]: models.sequelize.literal('CURRENT_TIMESTAMP')
                        }
                    },
                    offset,
                    limit,
                    order: models.sequelize.col('time')
                }).then(events => {
                        res.render('event/all',{events: events.map(event => event.get({plain:true}))});
                    }
                );
            }
        },
        single: (req,res) => {
            console.log(req.params);
            models.Event.findById(req.params.id).then(event => {
                res.render('event/single', {event: event.get({plain: true}), count: event.count})
            })
        }
    },
    post: {
        create: (req,res) =>{
            console.log(req.file)
            var image = req.file.buffer.toString('base64');
            var headers = {
                Authorization:'Client-ID 39d2af2c4bd771e',
            };
            axios.post('https://api.imgur.com/3/image',{image},{headers}).then(response => {
                req.body.imageURL = response.data.data.link;
                req.user.createEvent(req.body);
                console.log(req.body);
                res.redirect('/');
            });
        }
    }
}