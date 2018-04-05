var express = require('express');
var router = express.Router();

module.exports = (passport) => {
    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

    router.get('/users', function(req, res, next) {
        res.send('respond with a resource');
    });
    router.get('/signup', function(req, res) {
        res.render('signup');
    });
    router.get('/signin', signin = function(req, res) {
        res.render('signin');
    })
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/',
        failureRedirect: '/signup'
    }));
    router.post('/signin', passport.authenticate('signin', {
        successRedirect: '/',
        failureRedirect: '/signin'
    }));
    return router
};