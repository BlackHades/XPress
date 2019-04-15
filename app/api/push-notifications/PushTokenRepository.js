const {PushToken} = require("../../../database/sequelize");

const createOrUpdate = (userId, pushToken) => {
    return PushToken.createOrUpdate({where:{token:pushToken}, defaults:{userId:userId, token:pushToken}})
};

function upsert(userId, pushToken) {
    return PushToken
        .findOne({ where: {token:pushToken}})
        .then(function(obj) {
            if(obj) { // update
                return obj.update({userId:userId, token:pushToken});
            }
            else { // insert
                return PushToken.create({userId:userId, token:pushToken});
            }
        })
}

const fetchUserTokens = (userId,onlyToken = false) =>{
      if(onlyToken)
          return PushToken.findAll({attributes:["token"], where:{userId:userId}});
      else
          return PushToken.findAll({where:{userId:userId}});


};


module.exports = {
    createOrUpdate, fetchUserTokens, upsert
};