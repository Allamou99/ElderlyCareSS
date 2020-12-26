var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Config = require('./config');
var indexRouter = require('./routes/index');

var usersRouter = require('./routes/users');
var requestRouter = require('./routes/requests');
var feedbackRouter = require('./routes/feedbackRoute');
var cors = require('cors')
//atlas cloud
const mongo_URI = 'mongodb+srv://projetintegre:azerty123@test.7d6e8.mongodb.net/test?retryWrites=true&w=majority'
const mongoose = require('mongoose');
//local
var url = Config.link;
//cloud_connexion
const connect = mongoose.connect(mongo_URI , {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
connect.then((db)=>{
  console.log('Connected to the Server');
}, (err)=>{console.log(err); });

var passport = require('passport');

var app = express();
app.use(cors());
app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/users', usersRouter);
app.use('/requests', requestRouter);
app.use('/feedbacks',feedbackRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
