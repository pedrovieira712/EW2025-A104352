var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

var mongoDB = 'mongodb://localhost:27017/diario_digital'
mongoose.connect(mongoDB)
var connection = mongoose.connection
connection.on('error', console.error.bind(console,'Erro na conexão a MongoDB'))
connection.once('open', ()=>console.log('Conexão estabelecida MongoDB'))

var userRouter = require('./routes/user');
var itemRouter = require('./routes/item');
var categoryRouter = require('./routes/category');
var fileRouter = require('./routes/file');
var sipRouter = require('./routes/sip');
var logRouter = require('./routes/log');
var commentRouter = require('./routes/comment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);
app.use('/item', itemRouter);
app.use('/category', categoryRouter);
app.use('/file', fileRouter);
app.use('/sip', sipRouter);
app.use('/log', logRouter);
app.use('/comment', commentRouter);

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
