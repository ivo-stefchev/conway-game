var express = require('express');
var router = express.Router();
var mongo = require('../controller/mongo');
var passport = require('passport');
module.exports = router;

router.get('/', function(req, res, next) {
    req.session.redirect_after_successful_login = '/';
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
        /*
        res.render('register', {
            'title': 'Conway\'s Game of Life',
            'server_message': user_id
        });
        */
        var user = {
            '_id': user_id,
            'name': username,
            'pass': password
        };
        req.login(user, function(err) {
            if (err) {
                console.log(err);
            }
            return res.redirect('/');
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
