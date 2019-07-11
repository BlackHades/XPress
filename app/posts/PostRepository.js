const {Post} = require('../../database/sequelize');


const find = (postId, withComment = false) => {
  return Post.findOne({where:{id:postId}})
};

const all = () => {
  return Post.findAll({order: [['id', 'DESC']]});
};

const create = (post) => {
  return Post.create(post);
};


const  destroy = (postId) => {
  return Post.destroy({where:{id:postId}});
};


module.exports = {
  create,
    destroy,
    all,
    find
};