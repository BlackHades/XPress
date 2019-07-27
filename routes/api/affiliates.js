const express = require('express');
const router = express.Router();

//Middleware
const {authenticate, adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const affiliateController = require('../../app/affiliates/AffiliateController');

//Validators
const affiliateValidator  = require('../../app/affiliates/AffiliateValidator');



router.post('/', affiliateValidator.create(),  affiliateController.create);
router.use(authenticate);
router.get('/me',affiliateController.me);

router.use(adminAuth);
router.get('/all', affiliateController.all);
router.put('/status', affiliateController.status);
router.patch('/isActive', affiliateController.changeAffiliateActiveStatus);
router.patch('/type', affiliateController.changeAffiliateType);
//get all affiliate

module.exports = router;