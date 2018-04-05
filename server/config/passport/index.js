var bCrypt = require('bcrypt-nodejs');
var Strategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../../models').User
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });

});

passport.use('signup', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        console.log(req.body);
        User.findOrCreate({
            where: { email: email },
            defaults: {
                password: bCrypt.hashSync(password),
                name: req.body.name,
                studentNo: req.body.studentNo
            }
        }).spread((user, created) => {
            if (!created)
                return done(null, false, { message: 'That email is already taken' });
            else
                return done(null, user.get());
        })
    }));
passport.use('signin', new Strategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        User.findOne({ where: { email: email } }).then(function(user) {
            if (!user)
                return done(null, false, { message: 'Email does not exist' });
            if (!bCrypt.compareSync(password, user.password))
                return done(null, false, { message: 'Incorrect password.' });
            return done(null, user.get());
        })
    }));
module.exports = passport;