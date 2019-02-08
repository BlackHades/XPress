const {User} = require('../../../database/sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Fetch User By Email
 * @param email
 * @returns {*}
 */
let  fetchByEmail =  (email) => {
    return User.findOne({where:{email:email}});
};

/**
 * Update User Password
 * @returns {*}
 * @param update
 * @param id
 */
let updateUser = (update, id) => {
    return User.update(update,{where:{id:id}});
};

let all = () => {
  return User.findAll();
};

let destroy = (userId) => {
    return User.destroy({where:{id:userId}});
};
module.exports = {
  fetchByEmail,
    updateUser,
    all, destroy
};

