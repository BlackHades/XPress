"use strict";
const Repository = require("../Repository");
const {Affiliate} = require("../../database/sequelize");
class AffiliateRepository extends Repository{
    constructor(){
        super(Affiliate);
    }
}

module.exports = (new AffiliateRepository());