const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const errorHandler = require('./helpers/ErrorHandler');
const app = express();

const {createErrorResponse} = require('./helpers/response');
const {sequelize} = require('./database/sequelize');

sequelize.sync({force: false}).then(() => {
  console.log('Drop and Resync with { force: false }');
});


// // Set up mongoose connection
// // let mongoDB = 'mongodb://gacpedro:Goodbetter123@ds145304.mlab.com:45304/gac-db';
// let mongoDB = 'mongodb://localhost:27017/chidi4xpress';
// // mongoose.connect(mongoDB).then(db => console.log("Database Connected: " + JSON.stringify(db))).catch(err => console.log("Error: " + JSON.stringify(err)));
// mongoose.connect(mongoDB, {useNewUrlParser: true});
// mongoose.Promise = global.Promise;
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', function() {
//   console.log("db connected");
// });

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(expressValidator());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1',apiRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
