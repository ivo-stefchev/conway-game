var express = require('express');
var router = express.Router();
var mongo = require('../controller/mongo');
var passport = require('passport');
module.exports = router;

router.get('/', function(req, res, next) {
    res.render('login', {
        'title': 'Conway\'s Game of Life'
    });
});

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            var red_url = req.session.redirect_after_successful_login || '/';
            req.session.redirect_after_successful_login = '/';
            res.redirect(red_url);
        });
    })(req, res, next);
});

/*
router.post('/',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);
*/
