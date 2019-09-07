
"use strict";
const Repository = require("../../Repository");
const {SMS} = require("../../../database/sequelize");
class SMSRepository extends Repository{
    constructor(){
        super(SMS);
    }
}
module.exports = (new SMSRepository());