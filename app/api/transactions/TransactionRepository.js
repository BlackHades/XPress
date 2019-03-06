const { Transaction } = require("../../../database/sequelize");
const randomstring = require("randomstring");


/**
 * Generate Transaction ID
 * @returns {Promise<*|*>}
 */
const generateTransactionId = async () => {
    let transactionId = randomstring.generate({
        length: 12,
        charset: 'numeric'
    });
    let transaction = await Transaction.findOne({where:{transactionId:transactionId}});
    if(transaction == null)
        return transactionId;
    else
        return generateTransactionId();
};

//Create Transaction
const create = (data) => {
    return Transaction.create(data);
};

const getAllTransactions = () => {
    return Transaction.findAll();
};


const getUserTransaction = (userId) => {
    return Transaction.findAll({where:{userId:userId}})
};


const getAgentTransaction = (userId) => {
    return Transaction.findAll({where:{createdBy:userId}})
};

const find = (transactionId) => {
    return Transaction.findOne({where:{transactionId: transactionId}});
};

module.exports = {
    generateTransactionId,
    create,
    getAllTransactions,
    getUserTransaction,
    getAgentTransaction,
    find
};