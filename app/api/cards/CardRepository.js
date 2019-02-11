'use strict';
const {Card} = require('../../../database/sequelize');

const all = () => {
    return Card.findAll();
};

const fetchByName = (name) => {
    return Card.findOne({where:{name:name}});
};

const create = (data) => {
  return Card.create(data);
};


module.exports = {
    fetchByName,
    create,
    all
};