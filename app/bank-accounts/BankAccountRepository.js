"use strict";
const Repository = require("../Repository");
const {BankAccount} = require("../../database/sequelize");
class BankAccountRepository extends Repository{
    constructor(){
        super(BankAccount);
    }

    

}

module.exports = (new BankAccountRepository());