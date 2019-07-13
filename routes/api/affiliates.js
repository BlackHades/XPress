const express = require('express');
const router = express.Router();

//Middleware
const {adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const affiliateController = require('../../app/affiliates/AffiliateController');

//Validators
const affiliateValidator  = require('../../app/affiliates/AffiliateValidator');



router.post('/', affiliateValidator.create(),  affiliateController.create);

router.use(adminAuth);
router.post('/status', affiliateController.status);
//get all affiliate

module.exports = router;