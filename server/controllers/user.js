module.exports = {
    get: {
        login: (req, res) => res.render('user/login'),
        logout: (req, res) => {
            req.logout();
            req.session.destroy(err => res.redirect('/'));
        },
        signup: (req, res) => res.render('user/signup'),
    },
    post: {
        signup: (passport) => passport.authenticate('signup', {
            successReturnToOrRedirect: '/',
            failureRedirect: '/signup'
        }),
        login: (passport) => passport.authenticate('login', {
            successReturnToOrRedirect: '/',
            failureRedirect: '/login'
        })
    }

}