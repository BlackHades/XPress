const express = require('express');
const app = express();
const router = express.Router();
const authRouter = require('./auth');

//Controllers

const AuthController = require('../../app/api/auths/AuthController');
/* GET home page. */

router.post('/login', AuthController.validate('login'), AuthController.login);
router.post('/register', AuthController.validate('register'), AuthController.register);

app.use('/auth', authRouter);

// router.all('/auth/login', function(req, res, next) {
//     res.json({ title: 'All' });
// });
// router.use('/auth', authRouter);






module.exports = router;


