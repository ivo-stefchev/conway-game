var passport = require('passport')
var passport_strategy_local = require('passport-local').Strategy;
var mongo = require('./mongo');

passport.use(new passport_strategy_local({
        usernameField: 'login_username',
        passwordField: 'login_password'
    },
    function(username, password, done) {
        //console.log('authentication:');
        //console.log('username', username);
        //console.log('password', password);

        function on_find_user_callback(user)
        {
            if (!user)
            {
                //console.log('Incorrect username.');
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (user.pass !== password)
            {
                //console.log('Incorrect password.');
                return done(null, false, { message: 'Incorrect password.' });
            }

            //console.log('Correct sucksass.');
            return done(null, user);
        }

        mongo.find_user_by_username(username, on_find_user_callback);

        /*
        User.findOne({ username: username }, function (err, user) {
            if (err)
            {
                return done(err);
            }

            if (!user)
            {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (!user.validPassword(password))
            {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
        */
    }
));

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user._id);
});

passport.deserializeUser(function(user, done) {
    console.log('deserializeUser', user);
    done(null, user);
});
