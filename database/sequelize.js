'use strict';
const Sequelize = require('sequelize');
const UserModel = require('../app/api/users/UserModel');
const FileModel = require('../app/api/files/FileModel');
const CardModel = require('../app/api/cards/CardModel');
const MessageModel = require('../app/api/messages/MessageModel');
const OnlineUserModel = require('../app/api/online-users/OnlineUserModel');
const PostModel = require('../app/api/posts/PostModel');
const CommentModel = require("../app/api/comments/CommentModel");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});
// sequelize
//     .authenticate()
//     .then(() => {
//         // console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });


const User = UserModel(sequelize, Sequelize);
const File = FileModel(sequelize, Sequelize);
const Card = CardModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize);
const OnlineUser = OnlineUserModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);
const Comment = CommentModel(sequelize, Sequelize);

/**
 * Relationships
 */
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
    Comment
};

