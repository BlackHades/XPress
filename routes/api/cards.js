'use strict';
const express = require('express');
const router = express.Router();
//Middleware
const {authenticate, adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const cardController = require('../../app/cards/CardController');

//Validators
const cardValidator  = require('../../app/cards/CardValidator');


router.get('/all', cardController.all);
router.get('/all/name', cardController.groupCardsByName);
router.get("/available", cardController.available);
router.get('/show/:cardId', cardController.show);




//Admin Routes Only
router.use(authenticate,adminAuth);
router.post('/create', cardValidator.create(), cardController.create);
router.delete('/delete/:cardId', cardController.destroy);
router.post('/update/:cardId', cardValidator.update(), cardController.update);
router.get('/toggle-availability/:cardId',  cardController.toggleAvailability);

module.exports = router;

