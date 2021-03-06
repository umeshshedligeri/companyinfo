var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const passport = require("passport");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var company = require('./routes/company');
var listIds = require('./routes/listIds');
const keys = require("./config/keys");

var app = express();

//DB Connection
mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Mongoose"))
  .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public/files'));
//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/company', company);
app.use('/api/list', listIds);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
