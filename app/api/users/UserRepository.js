'use strict';
const {User} = require('../../../database/sequelize');
const userConstant = require("./UserConstant");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuid = require("uuid");

/**
 * Fetch User By Email
 * @param email
 * @param withPassword
 * @returns {*}
 */
const fetchByEmail =  (email, withPassword = false) => {
    if(withPassword)
        return User.scope("withPassword").findOne({where:{email:email}});
    else
        return User.findOne({where:{email:email}});
};

const find = (userId) => {
  return User.findByPk(userId);
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

const getAllNonUser = (id = false) => {
    if(id)
        return User.findAll({attributes:["id"],where:{roleId:{[Op.ne]:userConstant.USER}}});
    else
        return User.findAll({where:{roleId:{[Op.ne]:userConstant.USER}}});
};
/**generate unique User UID
 *
 * @returns {Promise<*>}
 */
const generateUid = async () => {
    let uid = uuid.v4();
    // console.log(uid);
    let user = await User.findOne({where:{uid:uid}});
    if(user == null)
        return uid;
    else
        return this.generateUid();
};
module.exports = {
  fetchByEmail,
    updateUser,
    all,
    destroy,
    generateUid,
    find,
    getAllNonUser
};

