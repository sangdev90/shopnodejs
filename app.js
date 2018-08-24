var createError = require('http-errors');
var express = require('express');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

require('./passport')(passport);
require('./chat')(io);
apiRouter(app);

const db_url = process.env.mLab_URL || process.env.DB_Localhost;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://heroku_jml0jqz8:rgpvrp7uao78ji0718avtc1jgf@ds127342.mlab.com:27342/heroku_jml0jqz8");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/users', usersRouter);



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

var port = process.env.PORT || 3000;
http.listen(port,()=>{
	console.log(`Server listen port ${port}`)
});



