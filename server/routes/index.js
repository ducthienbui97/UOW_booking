var express = require('express');
var router = express.Router();
var auth = require('connect-ensure-login');

module.exports = (passport) => {
    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', {
            title: 'Express'
        });
    });

    router.get('/users', auth.ensureLoggedIn(), function(req, res, next) {
        res.send('respond with a resource');
    });
    router.get('/signup', function(req, res) {
        res.render('signup');
    });
    router.get('/login', login = function(req, res) {
        res.render('login');
    });
    router.post('/signup', passport.authenticate('signup', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/signup'
    }));
    router.post('/login', passport.authenticate('login', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login'
    }));
    router.get('logout', function(req, res) {
        req.session.destroy((err) => res.redirect('/'));
    });
    return router
}