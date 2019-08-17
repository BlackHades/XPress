'use strict';
process.env.DEBUG="app:debug";
const createError = require('http-errors');
const express = require('express');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const http = require("http");
// const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const morgan = require('morgan');
const Sentry = require('@sentry/node');
const errorHandler = require('./helpers/ErrorHandler');
const app = express();
const {sequelize} = require('./database/sequelize');
const {seeder} = require('./database/databaseSeeder');
const debug = require("debug")("app:debug");
require("express-async-errors");

debug(process.env);
//sentry only enabled in production
if(process.env.APP_ENV == "production"){
    Sentry.init({ dsn: 'https://780ec425d68046ab8edabc8a37fa1597@sentry.io/1447209' });
    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());
}

sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      seeder();
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '20mb' }));
app.use(expressValidator());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));

try {
  fs.mkdirSync(path.join(__dirname, '/public/uploads/'))
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

require("./routes/router")(app);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
// const io = require('./socket')(server);
let io = require('socket.io')(server);
require("./socket").init(io);

global.io = io;
app.server = server;

//sentry only enabled in production
if(process.env.APP_ENV == "production"){
    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.errorHandler());
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
