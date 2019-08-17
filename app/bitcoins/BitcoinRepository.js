const {Bitcoin} = require("../../database/sequelize");
const cache = require("../../services/CacheManager");
const cacheKey = "bitcoins";
const create = (payload) => {
    cache.clear(cacheKey);
    return Bitcoin.create(payload);
};

const fetch = async () => {
    const fromCache = await cache.getAsync(cacheKey);
    if(fromCache)
        return JSON.parse(fromCache);

    const bitcoins = await Bitcoin.findAll({order: [['id', 'DESC']]});
    cache.setAsync(cacheKey, JSON.stringify(bitcoins));
    return bitcoins;
};

const find = (bitcoinId) => {
    return Bitcoin.findByPk(bitcoinId);
};

const update = (payload,bitcoinId) => {
    cache.clear(cacheKey);
    return Bitcoin.update(payload, {where:{id:bitcoinId}})
};

const destroy = (bitcoinId) => {
    cache.clear(cacheKey);
    return Bitcoin.destroy({where:{id:bitcoinId}});
};

module.exports = {
    create,
    fetch,
    find,
    update,
    destroy
};