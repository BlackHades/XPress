"use strict";
const Repository = require("../Repository");
const {Affiliate, Wallet} = require("../../database/sequelize");
class AffiliateRepository extends Repository{
    constructor(){
        super(Affiliate);
    }


    all(condition) {
        return this.Model.findAll({
            where: condition,
            include: [
                {
                    model: Wallet,
                    as: "wallet"
                }
            ]
        });
    }

}
module.exports = (new AffiliateRepository());