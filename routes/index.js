"use strict";
let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chiji14 Api Service' });
});





module.exports = router;
