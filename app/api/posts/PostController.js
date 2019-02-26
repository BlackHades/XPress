'use strict';
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');
const {Post} = require('../../../database/sequelize');
const postRepository = require('../posts/PostRepository');


/**
 * Fetch All Posts
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const all = async (req,res,next) => {
    let posts = await postRepository.all();
    console.log("Posts: " + JSON.stringify(posts));
    return createSuccessResponse(res,posts,"Fetched");
};

/**
 * Create Post
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const create = async (req, res, next) => {
    try{

        //validate request
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        //Extract body of request
        let payload = req.body;
        payload.postedBy = req.user.id;
        //create post
        let post = await postRepository.create(payload);
        console.log("Payload: " + payload);
        return createSuccessResponse(res,post,"Post Created ");
    }catch (e) {
        next(e);
    }
};


/**
 * Show Post
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const show = async (req,res,next) => {
    //get postId
    const postId = req.params.postId;

    //fetch post by id
    let post = await postRepository.find(postId, true);

    //get with comments
    return createSuccessResponse(res,post,"Post Fetched");
};


/**
 * Delete Post
 * @param req
 * @param res
 * @param next
 * @returns {void|*}
 */
const destroy = (req, res, next) => {
    try{

        //Extract body of request
        let postId = req.params.postId;

        //delete post
        postRepository.destroy(postId);
        return createSuccessResponse(res,null,"Post Deleted");
    }catch (e) {
        next(e);
    }
};


module.exports = {
    create,
    destroy,
    all,
    show
};