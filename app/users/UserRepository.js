'use strict';
const {User} = require('../../database/sequelize');
const userConstant = require("./UserConstant");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuid = require("uuid");
const Repository = require("../Repository");
class UserRepository extends Repository{
    constructor(){
        super(User);
        this.updateUser = this.updateUser.bind(this);
        this.generateUid = this.generateUid.bind(this);
        this.fetchByEmail = this.fetchByEmail.bind(this);
        this.fetchByPhone = this.fetchByPhone.bind(this);
        this.destroy = this.destroy.bind(this);
    }
    async generateUid(){
        let uid = uuid.v4();
        let user = await this.findOne({where:{uid:uid}});
        if(user == null)
            return uid;
        else
            return this.generateUid();
    }

    fetchByEmail(email, withPassword = false){
        if(withPassword)
            return this.Model.scope("withPassword","active").findOne({where:{email:email}});
        else
            return this.Model.findOne({where:{email:email}});
    }

    fetchByPhone (phone) {
        return this.Model.findOne({where:{phone:phone}});
    }

    updateUser(update, id) {
        return this.update({id}, update);
    }

    destroy(userId) {
        return this.Model.destroy({id:userId});
    }

    getAllNonUser(id = false) {
        if (id)
            return this.all({attributes: ["id"], where: {roleId: {[Op.ne]: userConstant.USER}}});
        else
            return this.all({where: {roleId: {[Op.ne]: userConstant.USER}}});
    }

    fetchByRole = (roleId) => {
        return this.all({where:{roleId:roleId}});
    };
}

module.exports = (new UserRepository());