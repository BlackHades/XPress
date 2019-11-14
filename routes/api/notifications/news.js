"use strict";
const express = require('express');
const router = express.Router();
//Controllers
const newsController = require('../../../app/notifications/news/NewsController');

router.get('/', newsController.fetch);
router.post('/send', newsController.send);

module.exports = router;
