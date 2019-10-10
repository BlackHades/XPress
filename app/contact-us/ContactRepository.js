const {Contact} = require("../../database/sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;




//Create
exports.create = payload => {
    return Contact.create(payload);
};


exports.fetch = () => {
   return Contact.findAll({order: [['id', 'DESC']]})
};