'use strict';
const express = require('express');
const app = express();
const router = express.Router();

//Middleware
const {authenticate,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const postController = require('../../app/api/posts/PostController');
const commentController = require('../../app/api/comments/CommentController');

//Validators
const postValidator  = require('../../app/validator/PostValidator');


//No Auth
router.get("/all", postController.all);

router.get("/view/:postId", postController.show);

router.get("/:postId/comments/fetch",commentController.fetchByPostId);


//General Auth
router.use(authenticate);
//Comment
router.post("/:postId/comments/create", commentController.create);

//Agents And Above


//Administrator Only
//Admin Middleware


router.use(adminAuth);
router.post('/create', postValidator.create(),  postController.create);
router.delete("/delete/:postId",postController.destroy);


//Comments
router.delete("/comments/delete/:commentId", commentController.destroy);





module.exports = router;

