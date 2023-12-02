var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const session = require("express-session");
var MongoStore = require("connect-mongo")(session);
const connectDB = require("./configs/db");
const passport = require('passport');
const flash = require('connect-flash');

var indexRouter = require('./routes/user/index');
var usersRouter = require('./routes/user/users');
var productsRouter = require("./routes/user/products");
var adminRouter = require('./routes/admin/index');
var cartRouter = require('./routes/user/cart');
const MongoDBStore = require('connect-mongodb-session')(session);


var app = express();

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    //session expires after 3 hours
    cookie: { maxAge: 60 * 1000 * 60 * 3 },
  })
);


connectDB();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", express.static(path.join(__dirname, '/')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/admin', adminRouter);
app.use('/cart', cartRouter);

app.use(flash());
app.use(passport.initialize());
// app.use(passport.session());



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

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
