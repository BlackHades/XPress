'use strict';
const { check } = require('express-validator/check');
const {find} = require('../api/users/UserRepository');

const postRepository = require('../api/posts/PostRepository');


const create = () => {
    return [
        check('postId').custom(value => {
            postRepository.find(value).then(post => {
                if(!post){
                    return Promise.reject("Post Not Found");
                }
            })
        }),
        check('content','Content is required').exists(),
    ];
};



module.exports = {
    create
};