var express = require('express');
var multer  = require('multer');
var upload = multer({storage:multer.memoryStorage()});
var router = express.Router();
var auth = require('connect-ensure-login');
var user = require('../controllers/user.js');
var event = require('../controllers/event.js');
module.exports = (passport) => {
    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', {
            title: 'Express'
        });
    });

    /*USERS*/
    router.get('/signup', user.get.signup);
    router.get('/login', user.get.login);
    router.get('/logout', user.get.logout);
    router.post('/signup', user.post.signup(passport));
    router.post('/login', user.post.login(passport));

    router.get('/event/new', auth.ensureLoggedIn(), event.get.create);
    router.get('/event',event.get.all(1));
    router.get('/event/:id', event.get.single)
    router.post('/event', auth.ensureLoggedIn(),upload.single('image'), event.post.create);
    return router
}