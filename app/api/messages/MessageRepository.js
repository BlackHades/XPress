const {Message} = require("../../../database/sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const create = (payload) => {
  return Message.create(payload);
};

/**
 * Fetch Message From a lastMessageId
 * @param userId
 * @param lastMessageId
 * @returns {*}
 */
const fetchMessage = (userId,lastMessageId) => {
    return Message.findAll({
      where:{
        [Op.or]:[{
          from:userId
        },{
          to:userId
        }],
        id:{
          [Op.gt]:lastMessageId
        }
      }
    });
};

module.exports = {
  create,
  fetchMessage
};