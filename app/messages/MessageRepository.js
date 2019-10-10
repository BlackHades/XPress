const {Message, User, Card, Bitcoin} = require("../../database/sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const create = (payload) => {
  return Message.create(payload);
};

/**
 * Fetch Message From a lastMessageId
 * @param userId
 * @param lastMessageId
 * @param limit
 * @returns {*}
 */
const fetchMessage = (userId,lastMessageId, limit) => {
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
      include:[
          {
        model: User,
        as: "sender"
      },
        {
        model: User,
        as: "receiver"
      },{
        model: User,
        as: "agent"
      },{
        model: Card,
        as: "card"
      },{
          model: Bitcoin,
          as: "bitcoin"
        }
      ],
      order: [['id', 'ASC']]
    });
};

const fetchMessageBySenderAndRecipient = (from,to, limit) => {
  return Message.findAll({
    where:{
      [Op.or]:[{
        from:from,
        to: to
      },{
        to:from,
        from: to
      }],
    },
    include:[
      {
        model: User,
        as: "sender"
      },
      {
        model: User,
        as: "receiver"
      },{
        model: User,
        as: "agent"
      },{
        model: Card,
        as: "card"
      },{
        model: Bitcoin,
        as: "bitcoin"
      }
    ],
    order: [['id', 'DESC']],
    limit: limit || 5000
  });
};


const fetchMessageBySenderAndRecipientReverse = (from,to, lastMessageId, limit, offset = 0) => {
  return Message.findAll({
    where:{
      [Op.or]:[{
        from:from,
        to: to
      },{
        to:from,
        from: to
      }],
      id:{
        [Op.lt]:lastMessageId
      }
    },
    include:[
      {
        model: User,
        as: "sender"
      },
      {
        model: User,
        as: "receiver"
      },{
        model: User,
        as: "agent"
      },{
        model: Card,
        as: "card"
      },{
        model: Bitcoin,
        as: "bitcoin"
      }
    ],
    order: [['id', 'DESC']],
    limit: limit || 5000
  });
};
const findByMessageId = (messageId) => {
    return Message.findOne({
      where:{
        mid:messageId
      },include:[
        {
          model: User,
          as: "sender"
        },
        {
          model: User,
          as: "receiver"
        },{
          model: User,
          as: "agent"
        },{
          model: Card,
          as: "card"
        },{
          model: Bitcoin,
          as: "bitcoin"
        }
      ],
    })
};

const update = (messageId, payload) => {
    return Message.update(payload,{where:{mid:messageId}});
};

module.exports = {
  create,
  fetchMessage,
  update,
  findByMessageId,
  fetchMessageBySenderAndRecipient,
  fetchMessageBySenderAndRecipientReverse
};