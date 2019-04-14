const {PushToken} = require("../../../database/sequelize");

const createOrUpdate = (userId, pushToken) => {
    return PushToken.findOrCreate({where:{token:pushToken},defaults:{userId:userId}})
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