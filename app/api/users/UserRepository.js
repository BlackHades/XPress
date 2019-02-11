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
const updateUser = (update, id) => {
    return User.update(update,{where:{id:id}});
};

const all = () => {
  return User.findAll();
};

const destroy = (userId) => {
    return User.destroy({where:{id:userId}});
};
module.exports = {
  fetchByEmail,
    updateUser,
    all, destroy
};

