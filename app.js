const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const filesRouter = require('./routes/api/files');
const apiRouter = require('./routes/api');
const errorHandler = require('./helpers/ErrorHandler');
const app = express();
const {seeder} = require('./database/databaseSeeder');

const {sequelize} = require('./database/sequelize');

sequelize.sync({force: false}).then(() => {
  // console.log('Drop and Resync with { force: false }');
  seeder()
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(expressValidator());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve('./public')));



app.use('/', indexRouter);
app.use('/api/v1',apiRouter);
app.use('/api/v1/users',usersRouter);
app.use('/api/v1/files',filesRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
