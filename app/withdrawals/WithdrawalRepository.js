"use strict";
const Repository = require("../Repository");
const {Withdrawal, Wallet} = require("../../database/sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {Affiliate, User} = require("../../database/sequelize");

class WithdrawalRepository extends Repository{
    constructor(){
        super(Withdrawal);
        this.getWithdrawals = this.getWithdrawals.bind(this);
    }

    getWithdrawals(condition = {}, page, limit){
        const offset = limit * (page - 1);
        const query = {};
        if(offset && offset > 0)
            query.offset = offset;
        query.limit = parseInt(limit);
        return this.Model.findAll({
            where: condition,
            include:[
                {
                    model: User,
                    as: "user",
                    include: [
                        {
                            model: Wallet,
                            as: "wallet"
                        }
                    ]
                },{
                    model: Affiliate,
                    as: "affiliate",
                    include: [
                        {
                            model: Wallet,
                            as: "wallet"
                        }
                    ]
                }
            ],
            order: [['id', 'DESC']],
            ...query
        });
        // return this.paginate(condition, page, limit);
    }
}

module.exports = (new WithdrawalRepository());