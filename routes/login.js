var express = require('express');
var router = express.Router();
var url = require('url')
var mongo = require('../controller/mongo');
var gc = require('../controller/global_const');
var passport = require('passport');
var passport_strategy_local = require('passport-local').Strategy;
module.exports = router;

router.get('/', function(req, res, next) {
    res.render('login', {
        'title': 'Conway\'s Game of Life'
    });
});

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

/*
router.post('/', function(req, res, next) {
    var data = req.body;
    passport.authenticate('local', function(err, user, info) {
        if (err)
        {
            return next(err);
        }

        if (!user)
        {
            return res.redirect('/login');
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/users/' + user.username);
        });
    })(req, res, next);
});
*/
