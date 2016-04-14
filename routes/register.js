var express = require('express');
var router = express.Router();
var url = require('url')
var mongo = require('../controller/mongo');
var gc = require('../controller/global_const');
var passport = require('passport');
var passport_strategy_local = require('passport-local').Strategy;
module.exports = router;

router.get('/', function(req, res, next) {
    res.render('register', {
        'title': 'Conway\'s Game of Life',
        'server_message': 'No message'
    });
});

router.post('/', function(req, res, next) {
    var data = req.body;
    console.log('Register: ', data);
    var username = data.register_username;
    var password = data.register_password;

    function registration_callback(user_id)
    {
        console.log('registration_callback');
        /*
        passport.serializeUser(function(user, done) {
            done(null, user_id);
        });
        */
        res.render('register', {
            'title': 'Conway\'s Game of Life',
            'server_message': user_id
        });
        /*
        return res.render('register', {
            'title': 'Conway\'s Game of Life',
            'server_message': user_id
        });
        */
    }

    console.log('Register2: ', username, password );
    mongo.add_user(username, password, registration_callback);

    /*
    return res.render('register', {
        'title': 'Conway\'s Game of Life',
        'server_message': 'Invalid valid'
    });
    */
    //return res.redirect('/');
    /*
    passport.authenticate('local', function(err, user, info) {
        if (err)
        {
            console.log('msg POST login 001');
            return next(err);
        }

        if (!user)
        {
            console.log('msg POST login 002');
            return res.redirect('/login');
        }

        req.logIn(user, function(err) {
            console.log('msg POST login 003');
            if (err) { return next(err); }
            return res.redirect('/users/' + user.username);
        });
    })(req, res, next);
    */
});