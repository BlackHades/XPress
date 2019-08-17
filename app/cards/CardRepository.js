'use strict';
const {Card} = require('../../database/sequelize');
const cache = require("../../services/CacheManager");
const cacheKey = "cards";
const all = async () => {

    const fromCache = await cache.getAsync(cacheKey);
    if(fromCache)
        return JSON.parse(fromCache);

    const cards = await Card.findAll();
    cache.setAsync(cacheKey, JSON.stringify(card));
    return cards;
};

const available = () => {
    return Card.findAll({where:{isAvailable:1}});
};

const fetchByName = (name) => {
    return Card.findOne({where:{name:name}});
};

const update = (data,id) => {
    cache.clear(cacheKey);
    cache.clear(`${cacheKey}:name`);
    return Card.update(data,{where:{id:id}})
};

const create = (data) => {
    cache.clear(cacheKey);
    cache.clear(`${cacheKey}:name`);
    return Card.create(data);
};

const find = (cardId) => {
    return Card.findByPk(cardId);
};


const groupByName = () => {
    return Card.findAll({
        group:"name"
    });
};


const destroy = (cardId) => {
    cache.clear(cacheKey);
    cache.clear(`${cacheKey}:name`);
    return Card.destroy({where:{id:cardId}});
};

module.exports = {
    fetchByName,
    create,
    all,
    update,
    destroy,
    find,
    groupByName,
    available
};