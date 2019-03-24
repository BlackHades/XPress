const {PushToken} = require("../../../database/sequelize");

const createOrUpdate = (userId, pushToken) => {
    return PushToken.findOrCreate({where:{token:pushToken},defaults:{userId:userId}})
};


module.exports = {
    createOrUpdate
};