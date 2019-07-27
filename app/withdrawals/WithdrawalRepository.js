"use strict";
const Repository = require("../Repository");
const {Withdrawal} = require("../../database/sequelize");
class WithdrawalRepository extends Repository{
    constructor(){
        super(Withdrawal);
    }
}

module.exports = (new WithdrawalRepository());