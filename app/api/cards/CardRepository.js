'use strict';
const {Card} = require('../../../database/sequelize');

const all = () => {
    return Card.findAll();
};

const available = () => {
    return Card.findAll({where:{isAvailable:1}});
}

const fetchByName = (name) => {
    return Card.findOne({where:{name:name}});
};

const update = (data,id) => {
    return Card.update(data,{where:{id:id}})
};

const create = (data) => {
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