const {Message} = require("../../../database/sequelize");

const create = (payload) => {
  return Message.create(payload);
};


module.exports = {
  create
};