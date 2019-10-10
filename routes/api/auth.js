const express = require('express');
const router = express.Router();

const {authenticate,agentAuth,adminAuth, refresh} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const AuthController = require('../../app/auths/AuthController');


router.get('auth/login', function(req, res, next) {
    res.send({ title: 'auth' });
});

router.get('auth/register', function(req, res, next) {
    res.send({ title: 'auth' });
});

router.use(refresh);
router.get("/refresh-token",AuthController.refreshToken);



module.exports = router;
