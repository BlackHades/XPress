const express = require('express');
const router = express.Router();

const {authenticate} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const MessageController = require('../../app/messages/MessageController');

router.use(authenticate);
router.post("/fetch",MessageController.fetchMessagesRequest);



module.exports = router;
