const { Transaction, User, Card, Bitcoin } = require("../../database/sequelize");
const randomstring = require("randomstring");
const Sequelize = require("sequelize");
const Repository = require("../Repository");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
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
    dialectOptions: {
        // socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
    },
    operatorsAliases: false,
    timezone: "+01:00", //for writing to database,
    // logging: true
    logging: process.env.APP_ENV == "development"
});

class TransactionRepository extends Repository{
    constructor(){
        super(Transaction);
        this.generateTransactionId = this.generateTransactionId.bind(this);
        this.getAllTransactions = this.getAllTransactions.bind(this);
        this.getAgentTransaction = this.getAgentTransaction.bind(this);
        this.getUserTransaction = this.getUserTransaction.bind(this);
    }

    async generateTransactionId (){
        let transactionId = randomstring.generate({
            length: 12,
            charset: 'numeric'
        });
        let transaction = await this.findOne({transactionId});
        if(transaction == null)
            return transactionId;
        else
            return await this.generateTransactionId();
    };
 
    getAllTransactions(){
        return this.Model.findAll({
            include:[{
                model: Card,
                as: "card"
            },{
                model: User,
                as: "user"
            },{
                model: User,
                as: "agent",
            },{
                model: Bitcoin,
                as: "bitcoin",
            }]
        });
    }


    getAgentTransaction(userId){
        return this.Model.findAll({
            where:{createdBy:userId},
            include:[{
                model: Card,
                as: "card"
            },{
                model: User,
                as: "user"
            },{
                model: User,
                as: "agent",
            },{
                model: Bitcoin,
                as: "bitcoin",
            }]
        })
    };  

    find(transactionId){
        return this.Model.findOne({
            where:{transactionId: transactionId},
            include:[{
                model: Card,
                as: "card"
            },{
                model: User,
                as: "user"
            },{
                model: User,
                as: "agent",
            },{
                model: Bitcoin,
                as: "bitcoin",
            }]
        });
    };

    destroy(transactionId){
        return super.destroy({transactionId: transactionId})
    }

    getUserTransaction (userId){
        return Transaction.findAll({
            where:{userId:userId},
            include:[{
                model: Card,
                as: "card"
            },{
                model: User,
                as: "user"
            },{
                model: User,
                as: "agent",
            },{
                model: Bitcoin,
                as: "bitcoin",
            }]
        })
    };

    getLeaderbaords(filter,id) {
        if(filter === "User") {
            return sequelize.query( `SELECT users.name, users.avatar,  COUNT(transactions.transactionId) as transaction_count, SUM(transactions.amount) as transaction_amount, CASE WHEN users.id = ${id} THEN true ELSE false END as is_present_user FROM transactions INNER JOIN users ON transactions.userId = users.id WHERE DAY(CURRENT_TIMESTAMP ()) - DAY(transactions.createdAt) < 7  AND dayofweek(transactions.createdAt) - 6 < 0  AND users.id = ${id} GROUP BY users.name, users.avatar, is_present_user ORDER BY ${filter === 'Amount' ? `transaction_amount` : `transaction_count`} DESC`,
            { type: Sequelize.QueryTypes.SELECT }
            )
        }
        return sequelize.query(
            `SELECT users.name, users.avatar, COUNT(transactions.transactionId) as transaction_count, SUM(transactions.amount) as transaction_amount, CASE WHEN users.id = ${id} THEN true ELSE false END as is_present_user FROM transactions INNER JOIN users ON transactions.userId = users.id WHERE DAY(CURRENT_TIMESTAMP ()) - DAY(transactions.createdAt) < 7 AND dayofweek(transactions.createdAt) - 6 < 0 GROUP BY users.name, users.avatar,is_present_user ORDER BY ${filter === 'Amount' ? `transaction_amount` : `transaction_count`} DESC`,
            { type: Sequelize.QueryTypes.SELECT }
            // 'SELECT * FROM projects WHERE status = ?',
            // { raw: true, replacements: ['active'] }
          );
    }
}

module.exports = (new TransactionRepository());