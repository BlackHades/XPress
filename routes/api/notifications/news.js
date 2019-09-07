"use strict";
const express = require('express');
const router = express.Router();
//Controllers
const newsController = require('../../../app/notifications/news/NewsController');

router.post('/send', newsController.send);
router.get('/', newsController.fetch);

module.exports = router;


