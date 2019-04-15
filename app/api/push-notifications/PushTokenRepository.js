const {PushToken} = require("../../../database/sequelize");

const createOrUpdate = (userId, pushToken) => {
    return PushToken.createOrUpdate({where:{token:pushToken}, defaults:{userId:userId, token:pushToken}})
};

const fetchUserTokens = (userId,onlyToken = false) =>{
      if(onlyToken)
          return PushToken.findAll({attributes:["token"], where:{userId:userId}});
      else
          return PushToken.findAll({where:{userId:userId}});


};


module.exports = {
    createOrUpdate, fetchUserTokens
};