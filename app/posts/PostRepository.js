const {Post} = require('../../database/sequelize');
const cache = require("../../services/CacheManager");
const cacheKey = "posts";
const find = (postId) => {
    return Post.findOne({where: {id: postId}})
};

const all = async () => {
    const fromCache = await cache.getAsync(cacheKey);
    if (fromCache)
        return JSON.parse(fromCache);

    const posts = await Post.findAll({order: [['id', 'DESC']]});
    cache.setAsync(cacheKey, JSON.stringify(posts));
    return posts;
};

const create = (post) => {
    cache.clear(cacheKey);
    return Post.create(post);
};


const destroy = (postId) => {
    cache.clear(cacheKey);
    return Post.destroy({where: {id: postId}});
};


module.exports = {
    create,
    destroy,
    all,
    find
};