'use strict';
const express = require('express');
const app = express();
const router = express.Router();

//Middleware
const {authenticate,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const cardController = require('../../app/api/cards/CardController');

//Validators
const cardValidator  = require('../../app/validator/CardValidator');

//General Auth
router.use(authenticate);


//Agents And Above


//Administrator Only
//Admin Middleware


router.use(adminAuth);
router.post('/create', cardValidator.create(), cardController.create);
router.get('/all', cardController.all);
router.delete('/delete/:cardId', cardValidator.destroy(), cardController.destroy);
router.post('/update/:cardId', cardValidator.update(), cardController.update);

module.exports = router;

