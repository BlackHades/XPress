'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 30,
        min: 0,
        acquire: 1000000,
        idle: 10000
    },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
    // dialectOptions: {
    //     socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
    // },
    operatorsAliases: false,
    timezone: "+01:00", //for writing to database,
    // logging: true
    logging: process.env.APP_ENV == "development"
});


const User = require('../app/users/UserModel')(sequelize, Sequelize);
const File = require('../app/files/FileModel')(sequelize, Sequelize);
const Card = require('../app/cards/CardModel')(sequelize, Sequelize);
const Message = require('../app/messages/MessageModel')(sequelize, Sequelize);
const OnlineUser = require('../app/online-users/OnlineUserModel')(sequelize, Sequelize);
const Post = require('../app/posts/PostModel')(sequelize, Sequelize);
const Comment = require("../app/comments/CommentModel")(sequelize, Sequelize);
const Transaction = require("../app/transactions/TransactionModel")(sequelize, Sequelize);
const PushToken = require("../app/push-notifications/PushTokenModel")(sequelize, Sequelize);
const Bitcoin = require("../app/bitcoins/BitcoinModel")(sequelize, Sequelize);
const Contact = require("../app/contact-us/ContactModel")(sequelize, Sequelize);
const Utility = require("../app/utilities/UtilityModel")(sequelize, Sequelize);
const Affiliate = require("../app/affiliates/AffiliateModel")(sequelize, Sequelize);
const Verification = require("../app/verifications/VerificationModel")(sequelize, Sequelize);
const UserChat = require("../app/user-chats/UserChatModel")(sequelize, Sequelize);
const Mailer = require("../app/notifications/mailers/MailModel")(sequelize, Sequelize);
const SMS = require("../app/notifications/sms/SMSModel")(sequelize, Sequelize);
const News = require("../app/notifications/news/NewsModel")(sequelize, Sequelize);
const Wallet = require("../app/wallets/WalletModel")(sequelize, Sequelize);
const WalletLog = require("../app/wallet-logs/WalletLogModel")(sequelize, Sequelize);
const BankAccount = require("../app/bank-accounts/BankAccountModel")(sequelize, Sequelize);
const Withdrawal = require("../app/withdrawals/WithdrawalModel")(sequelize, Sequelize);
/**
 * Relationships
 */

/**
 * Transactions
 */
Transaction.belongsTo(Card, { as: "card", foreignKey: "cardId" });
Transaction.belongsTo(Bitcoin, { as: "bitcoin", foreignKey: "bitcoinId" });
Transaction.belongsTo(User, { as: "user", foreignKey: "userId" });
Transaction.belongsTo(User, { as: "agent", foreignKey: "createdBy" });

/**
 * Users
 */
User.hasMany(Transaction, { as: "transactions", foreignKey: "userId", targetKey: "id" });
User.hasMany(PushToken, {
    as: "pushTokens",
    foreignKey: "userId",
    targetKey: "id"
});
User.hasOne(Wallet, {
    as: "wallet",
    foreignKey: "userId",
    sourceKey: "id",
    scope: {
        userType: "user"
    }
});

/**
 * Cards
 */
Card.hasMany(Transaction, { as: "transactions", foreignKey: "cardId", targetKey: "id" });

/**
 *  Message
 * */

Message.belongsTo(User, { as: "agent", foreignKey: "agentId" });
Message.belongsTo(User, { as: "sender", foreignKey: "from" });
Message.belongsTo(User, { as: "receiver", foreignKey: "to" });
Message.belongsTo(Card, { as: "card", foreignKey: "cardId" });
Message.belongsTo(Bitcoin, { as: "bitcoin", foreignKey: "bitcoinId" });

/**
 *
 * Withdrwals
 */

Withdrawal.belongsTo(User, {
    as: "user",
    foreignKey: "userId",
    constraints: false,
});

Withdrawal.belongsTo(Affiliate, {
    as: "affiliate",
    foreignKey: "userId",
    constraints: false
});


/**
 *  Affiliate
 */

Affiliate.hasOne(Wallet, {
    as: "wallet",
    foreignKey: "userId",
    sourceKey: "id",
    constraints: false,
    scope: {
        userType: "affiliate"
    }
});




module.exports = {
    sequelize,
    User,
    File,
    Card,
    Message,
    OnlineUser,
    Post,
    Comment,
    Transaction,
    PushToken,
    Bitcoin,
    Contact,
    Utility,
    Affiliate,
    Verification,
    UserChat,
    Mailer,
    SMS,
    News,
    Wallet,
    WalletLog,
    BankAccount,
    Withdrawal
};

