"use strict";
const Repository = require("../Repository");
const {WalletLog} = require("../../database/sequelize");
class WalletLogRepository extends Repository{
    constructor(){
        super(WalletLog);
    }
}

module.exports = (new WalletLogRepository());