const {Message, User} = require("../../../database/sequelize");
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
      },
      include:[{
        model: User,
        as: "sender"
      },{
        model: User,
        as: "receiver"
      },{
        model: User,
        as: "agent"
      }]
    });
};

const findByMessageId = (messageId) => {
    return Message.findOne({
      where:{
        mid:messageId
      },
      include:[{
        model: User,
        as: "sender"
      },{
        model: User,
        as: "receiver"
      },{
        model: User,
        as: "agent"
      }]
    })
};

const update = (messageId, payload) => {
    return Message.update(payload,{where:{mid:messageId}});
};

module.exports = {
  create,
  fetchMessage,
  update,
  findByMessageId
};