var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  throw  new Error("A New Error");
});





module.exports = router;
