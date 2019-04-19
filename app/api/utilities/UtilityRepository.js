'use strict';
const {Utility} = require('../../../database/sequelize');

exports.fetchByKey = key => {
    return Utility.findOne({where:{key:key}});
};


exports.fetchAll = () => {
    return Utility.findAll();
};


exports.upsert = (key,value) => {
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
