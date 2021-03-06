require('dotenv').config();
var express = require('express');
var app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var auth = require('./auth');

var routes = require('./routes/index');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}));

// Passport/session initialization
app.use(auth.passport.initialize());
app.use(auth.passport.session());

// Set static files to folder /public
app.use(express.static(__dirname + '/public'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* error handlers */

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
