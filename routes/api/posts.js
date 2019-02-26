const express = require('express');
const app = express();
const router = express.Router();

//Middleware
const {authenticate,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const postController = require('../../app/api/posts/PostController');

//Validators
const postValidator  = require('../../app/validator/PostValidator');


//No Auth
router.get("/all", postController.all);


//General Auth
router.use(authenticate);


//Agents And Above


//Administrator Only
//Admin Middleware


router.use(adminAuth);
router.post('/create', postValidator.create(),  postController.create);
router.delete("/delete/:postId",postController.destroy);
module.exports = router;

