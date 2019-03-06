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



module.exports = {
    generateTransactionId,
    create
};