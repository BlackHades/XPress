"use strict";
const Repository = require("../Repository");
const {Wallet} = require("../../database/sequelize");
class WalletRepository extends Repository{
    constructor(){
        super(Wallet);
    }
}

module.exports = (new WalletRepository());