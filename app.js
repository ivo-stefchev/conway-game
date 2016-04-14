var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('./controller/mongo');
var express_session = require('express-session')
var authentication = require('./controller/authentication');
var passport = require('passport')
var uuid = require('uuid');
mongo.init();

var app = express();

var index = require('./routes/index');
var create = require('./routes/create');
var view = require('./routes/view');
var create_pattern = require('./routes/create_pattern');
var register_for_game = require('./routes/register_for_game');
var web_socket_routes = require('./routes/web_socket_routes');
var delete_list = require('./routes/delete_list');
var delete_item = require('./routes/delete_item');
var login = require('./routes/login');
var register = require('./routes/register');

var controller_matrix = require('./controller/matrix');
var gc = require('./controller/global_const');

app.locals.rows = gc.ROWS;
app.locals.cols = gc.COLS;
app.locals.cell_size = gc.CELL_SIZE;
app.locals.generation_timeout = gc.TIMEOUT;
// deprecated
app.locals.register_new_game = function(pattern) {
    controller_matrix.construct(
        pattern.create_pattern_height,
        pattern.create_pattern_width,
        pattern.create_pattern
    );
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express_session({
    genid: function(req) {
        // use UUIDs for session IDs 
        return uuid.v4();
    },
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/create', create);
app.use('/view', view);
app.use('/create_pattern', create_pattern);
app.use('/register_for_game', register_for_game);
app.use('/delete_list', delete_list);
app.use('/delete_item', delete_item);
app.use('/login', login);
app.use('/register', register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
