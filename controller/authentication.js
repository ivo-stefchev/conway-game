var passport = require('passport')
var passport_strategy_local = require('passport-local').Strategy;
var mongo = require('./mongo');

passport.use(new passport_strategy_local({
        usernameField: 'login_username',
        passwordField: 'login_password'
    },
    function(username, password, done) {
        function on_find_user_callback(user)
        {
            if (!user)
            {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (user.pass !== password)
            {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        }

        mongo.find_user_by_username(username, on_find_user_callback);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(user_id, done) {
    function on_find_user_callback(user)
    {
        done(null, user);
    }

    mongo.find_user_by_id(user_id, on_find_user_callback);
});
