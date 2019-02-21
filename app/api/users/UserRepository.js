const {User} = require('../../../database/sequelize');
const userConstant = require("./UserConstant");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuid = require("uuid");

/**
 * Fetch User By Email
 * @param email
 * @returns {*}
 */
const fetchByEmail =  (email) => {
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
let updateUser = (update, id) => {
    return User.update(update,{where:{id:id}});
};

let all = () => {
  return User.findAll();
};

let destroy = (userId) => {
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

