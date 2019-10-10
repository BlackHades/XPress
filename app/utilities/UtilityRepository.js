'use strict';
const debug = require("debug")("app:debug");
const {Utility} = require('../../database/sequelize');
const cache = require("../../services/CacheManager");
const cacheKey = "utilities";
exports.fetchByKey = key => {
    return Utility.findOne({where:{key:key}});
};


exports.fetchAll = async () => {
    const fromCache = await cache.getAsync(cacheKey);
    if(fromCache)
        return JSON.parse(fromCache);
    const utilities = await Utility.findAll();
    cache.setAsync(cacheKey, JSON.stringify(utilities));
    return utilities;
};


exports.upsert = (key,value) => {
    cache.clear(cacheKey);
    return Utility
        .findOne({ where: {key: key}})
        .then(function(obj) {
            if(obj) { // update
                return obj.update({key:key, value:value});
            }
            else { // insert
                return Utility.create({key:key, value:value});
            }
        })
};
