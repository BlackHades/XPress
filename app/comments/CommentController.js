'use strict';
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../helpers/response');
const {validationResult } = require('express-validator/check');
const {
    Comment
} = require('../../database/sequelize');
const commentRepository = require('./CommentRepository');


/**
 * Fetch Post Comments
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const fetchByPostId = async (req, res, next) => {
    const postId = req.params.postId;
    let comments = await commentRepository.fetchByPostId(postId);
    console.log("comments: " + JSON.stringify(comments));
    return createSuccessResponse(res, comments, "Comments Fetched");
};

/**
 * Create Comment
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const create = async(req, res, next) => {
    try{

        //validate request
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        //Extract body of request
        let payload = req.body;
        payload.userId = req.user.id;
        payload.postId = req.params.postId;
        //create comment
        let comment = await commentRepository.create(payload);
        console.log("Payload: " + payload);
        return createSuccessResponse(res,comment,"Comment Created ");
    }catch (e) {
        next(e);
    }
};


//fetch post comments


//delete comments
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
        let commentId = req.params.commentId;

        //delete comment
        commentRepository.destroy(commentId);
        return createSuccessResponse(res,null,"Comment Deleted");
    }catch (e) {
        next(e);
    }
};



module.exports = {
  create, destroy, fetchByPostId
};