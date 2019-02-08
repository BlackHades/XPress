const Sequelize = require('sequelize');
const config = require('../config/config');
const UserModel = require('../app/api/users/UserModel');
const FileModel = require('../app/api/files/FileModel');

const sequelize = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    // logging: true
});
sequelize
    .authenticate()
    .then(() => {
        // console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const User = UserModel(sequelize, Sequelize);
const File = FileModel(sequelize, Sequelize);
// const Message = MessageModel(sequelize, Sequelize);
// const OnlineUser = OnlineUserModel(sequelize, Sequelize);
// const MessageDelete = MessageDeleteModel(sequelize, Sequelize);
// const Group = GroupModel(sequelize,Sequelize);
// const GroupMember = GroupMemberModel(sequelize,Sequelize);
// const Token = TokenModel(sequelize,Sequelize);
// const OneSignalToken = OneSignalTokenModel(sequelize,Sequelize);
// const Mute = MuteModel(sequelize,Sequelize);


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


module.exports = {
    sequelize,
    User,
    File
};

