const express = require('express');
const router = express.Router();



router.get('auth/login', function(req, res, next) {
    res.send({ title: 'auth' });
});

router.get('auth/register', function(req, res, next) {
    res.send({ title: 'auth' });
});


module.exports = router;
