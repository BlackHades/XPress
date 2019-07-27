const { Transaction, User, Card, Bitcoin } = require("../../database/sequelize");
const randomstring = require("randomstring");
const Repository = require("../Repository");

class TransactionRepository extends Repository{
    constructor(){
        super(Transaction);
        this.generateTransactionId = this.generateTransactionId.bind(this);
        this.getAllTransactions = this.getAllTransactions.bind(this);
        this.getAgentTransaction = this.getAgentTransaction.bind(this);
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

}

module.exports = (new TransactionRepository());