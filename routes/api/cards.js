'use strict';
const express = require('express');
const router = express.Router();
//Middleware
const {adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const cardController = require('../../app/api/cards/CardController');

//Validators
const cardValidator  = require('../../app/validator/CardValidator');


router.get('/all', cardController.all);
router.get('/all/name', cardController.groupCardsByName);
router.get('/show/:cardId', cardController.show);




//Admin Routes Only
router.use(adminAuth);
router.post('/create', cardValidator.create(), cardController.create);
router.delete('/delete/:cardId', cardController.destroy);
router.post('/update/:cardId', cardValidator.update(), cardController.update);
router.get('/toggle-availability/:cardId',  cardController.toggleAvailability);

module.exports = router;

