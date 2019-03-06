'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
// const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const morgan = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const filesRouter = require('./routes/api/files');
const passwordsRouter = require('./routes/api/passwords');
const cardsRouter = require('./routes/api/cards');
const postRouter = require('./routes/api/posts');
const apiRouter = require('./routes/api');
const errorHandler = require('./helpers/ErrorHandler');
const app = express();
const {sequelize} = require('./database/sequelize');
const {seeder} = require('./database/databaseSeeder');





sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      // seeder();

      sequelize.sync({force: false}).then(() => {
          seeder();
      });
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(expressValidator());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));

try {
  fs.mkdirSync(path.join(__dirname, '/public/uploads/'))
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}
app.use('/', indexRouter);
app.use('/api/v1',apiRouter);
app.use('/api/v1/users',usersRouter);
app.use('/api/v1/files',filesRouter);
app.use('/api/v1/passwords',passwordsRouter);
app.use('/api/v1/cards',cardsRouter);
app.use('/api/v1/posts',postRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
