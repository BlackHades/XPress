"use strict";
const express = require('express');
const router = express.Router();
//Controllers
const newsController = require('../../../app/notifications/news/NewsController');
const { adminAuth } = require('../../../app/middleware/ApiAuthMiddleware');

router.get('/', newsController.fetch);

// router.use(adminAuth); // - i dont know why this is not working
router.post('/send', newsController.send);

module.exports = router;
