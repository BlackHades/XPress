const express = require('express');
const router = express.Router();

//Middleware
const {authenticate, adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const affiliateController = require('../../app/affiliates/AffiliateController');

//Validators
const affiliateValidator  = require('../../app/affiliates/AffiliateValidator');



router.post('/', affiliateValidator.create(),  affiliateController.create);

router.use(authenticate, adminAuth);
router.put('/status', affiliateController.status);
//get all affiliate

module.exports = router;