"use strict";
const Repository = require("../Repository");
const {UserChat} = require("../../database/sequelize");
class UserChatRepository extends Repository{
    constructor(){
        super(UserChat);
    }
}

module.exports = (new UserChatRepository());