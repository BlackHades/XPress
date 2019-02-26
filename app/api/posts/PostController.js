const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');
const {Post} = require('../../../database/sequelize');
const postRepository = require('../posts/PostRepository');



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
        console.log("Error: " + JSON.stringify(e));
        next(e);
    }
};


module.exports = {
    create,
    destroy,
    all
};