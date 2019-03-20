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


router.get('/all', cardController.all);
router.get('/all/name', cardController.groupCardsByName);
router.get('/show/:cardId', cardController.show);




//Agents And Above


//Administrator Only
//Admin Middleware


router.use(adminAuth);
router.post('/create', cardValidator.create(), cardController.create);
router.delete('/delete/:cardId', cardController.destroy);
router.post('/update/:cardId', cardValidator.update(), cardController.update);
router.get('/toggle-availability/:cardId',  cardController.toggleAvailability);

module.exports = router;

