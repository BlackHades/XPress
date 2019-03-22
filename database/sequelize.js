'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});


const User = require('../app/api/users/UserModel')(sequelize, Sequelize);
const File = require('../app/api/files/FileModel')(sequelize, Sequelize);
const Card = require('../app/api/cards/CardModel')(sequelize, Sequelize);
const Message = require('../app/api/messages/MessageModel')(sequelize, Sequelize);
const OnlineUser = require('../app/api/online-users/OnlineUserModel')(sequelize, Sequelize);
const Post = require('../app/api/posts/PostModel')(sequelize, Sequelize);
const Comment = require("../app/api/comments/CommentModel")(sequelize, Sequelize);
const Transaction = require("../app/api/transactions/TransactionModel")(sequelize, Sequelize);

/**
 * Relationships
 */

/**
 * Transactions
 */
Transaction.belongsTo(Card,{as: "card", foreignKey:"cardId"});
Transaction.belongsTo(User,{as: "user", foreignKey: "userId"});
Transaction.belongsTo(User,{as: "agent", foreignKey: "createdBy"});

/**
 * Users
 */
User.hasMany(Transaction,{as: "transactions", foreignKey:"userId",targetKey:"id"});


/**
 * Cards
 */
Card.hasMany(Transaction,{as: "transactions", foreignKey:"cardId",targetKey:"id"});

/**
 *  Message
 * */

Message.belongsTo(User,{as:"agent", foreignKey:"agentId"});
Message.belongsTo(User,{as:"sender", foreignKey:"from"});
Message.belongsTo(User,{as:"receiver", foreignKey:"to"});
//Users
// User.hasMany(Message,{ as: "sentMessages", foreignKey: "from",  targetKey: "id"});
// User.hasMany(Message,{as: "receivedMessages", foreignKey: "to", targetKey:"id"});
// User.hasMany(MessageDelete,{as: "deletedMessages", foreignKey: "user_id", targetKey: "id"});
// User.hasMany(OneSignalToken,{as:"pushTokens",foreignKey:"user_id", targetKey: "id"});
// User.hasMany(OnlineUser,{as:"socketIds",foreignKey:"user_id", targetKey: "id"});
//
//
// //Message
// Message.belongsTo(User,{as: "sender", foreignKey: "from"});
// Message.belongsTo(User,{as: "receiver", foreignKey: "to"});
// Message.belongsTo(Message, {as: "reply", foreignKey:"mid", targetKey: "reply_to"});
// // Message.belongsTo(Message, {as: "reply", foreignKey:"mid", targetKey: "reply_to"});
// Message.belongsTo(Group,{as: "group", foreignKey: "to"});
// Message.hasMany(OneSignalToken,{as: "pushTokens", foreignKey: "user_id", sourceKey: "to"});
// Message.hasMany(OnlineUser,{as: "receiverStream", foreignKey: "user_id", sourceKey: "to"});
// Message.hasMany(OnlineUser,{as: "senderStream", foreignKey: "user_id", sourceKey: "from"});
// Message.hasMany(Mute,{as: "mutes", foreignKey: "recipient_id",sourceKey: "to" });
// // Group
// Group.hasMany(GroupMember, {as: "members", foreignKey: "group_id", targetKey: "id"});
// Group.hasMany(Message,{as: "messages", foreignKey: "to"});
//
// //Group Members
// // GroupMember.belongsTo(Group, {as: "group", foreignKey:"group_id"});
// GroupMember.belongsTo(User, {as: "user", foreignKey:"user_id"});


//Mutes
// Mute.belongsTo

// sequelize.sync({ force: false })
//     .then(() => {
//         console.log(`Database & tables created!`)
//     });


//User Settings


module.exports = {
    sequelize,
    User,
    File,
    Card,
    Message,
    OnlineUser,
    Post,
    Comment,
    Transaction
};

