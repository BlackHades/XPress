const {User} = require('../../../database/sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



//OnlineUsers
let  fetchByEmail =  (email) => {
    return User.findOne({where:{email:email}});
};

module.exports = {
  fetchByEmail
};

