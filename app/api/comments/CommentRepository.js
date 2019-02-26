'use strict';
const {Comment} = require("../../../database/sequelize");


const create = (comment) => {
  return Comment.create(comment);
};


const fetchByPostId = (postId) => {
    return Comment.findAll({
        where:{
            postId:postId
        },
        order:[['id', 'DESC']]
    })
};

const destroy = (commentId) => {
    return Comment.destroy({where:{id:commentId}});
};

module.exports = {
  create, destroy, fetchByPostId
};