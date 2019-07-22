"use strict";
const Repository = require("../Repository");
const {Verification} = require("../../database/sequelize");
const randomString = require("randomstring");
class VerificationRepository extends Repository{
    constructor(){
        super(Verification);
        this.generateCode = this.generateCode.bind(this);
    }


    generateCode(){
        return randomString.generate({
            charset: "numeric",
            length: 6
        });
    }
}

module.exports = (new VerificationRepository());