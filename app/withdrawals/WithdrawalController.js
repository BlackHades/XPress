"use strict";
const {createSuccessResponse, createErrorResponse, validationHandler} = require("../../helpers/response");
const debug = require("debug")("app:debug");
const {validationResult} = require('express-validator/check');
const userRepository = require("../users/UserRepository");
const affiliateRepository = require("../affiliates/AffiliateRepository");
const walletRepository = require("../wallets/WalletRepository");
const withdrawalRepository = require("./WithdrawalRepository");
const bankAccountRepository = require("../bank-accounts/BankAccountRepository");
exports.fetch = async (req, res) => {
    let withdrawals, query = {};
    if(req.affiliate){
        query = {
            userId: req.affiliate.id,
            userType: "affiliate"
        };
    }else if(req.user && req.user.roleId == 3){
        query = {
            userId: req.user.id,
            userType: "user"
        };
    }
    withdrawals = await withdrawalRepository.getWithdrawals(query, req.query.page || 1, req.query.limit || 100);

    withdrawals = withdrawals.filter(withdrawal => {
       if(withdrawal.userType == "user"){
           delete withdrawal.dataValues.affiliate;
           delete withdrawal.dataValues.affiliateWallet;
       }
       else{
           delete withdrawal.dataValues.user;
           delete withdrawal.dataValues.userWallet;
       }

       return withdrawal;
    });
    return createSuccessResponse(res, withdrawals);
};

exports.request = async (req, res) => {
    const valFails = validationResult(req);
    if (!valFails.isEmpty())
        return createErrorResponse(res, validationHandler(valFails), valFails.array);

    const amount = req.body.amount || 0;

    let query = {};
    if(req.affiliate){
        query = {
            userId: req.affiliate.id,
            userType: "affiliate"
        };
    }else if(req.user && req.user.roleId == 3){
        query = {
            userId: req.user.id,
            userType: "user"
        };
    }else{
        return createErrorResponse(res, "Unauthorized");
    }
    const [wallet, created] = await  walletRepository.findOrCreate(query,{
        userId: query.userId,
        userType: query.userType,
        balance: 0
    });

    if(created || wallet.balance < amount)
        return createErrorResponse(res, "Insufficient balance");


    const bankAccount = await bankAccountRepository.findOne(query);
    if(!bankAccount)
        return createErrorResponse(res,"Kindly update your bank account details in the profile/settings section");

    query.amount = amount;

    const withdrawal = await withdrawalRepository.create(query);
    return createSuccessResponse(res, withdrawal, "Processing");
};

exports.status = async (req,res) => {
    const statusOption = ["SUCCESS","FAILED"];
    const { withdrawalId, status, reason} = req.body;
    if(!statusOption.includes(status))
        return createErrorResponse(res, "Status Option is invalid. SUCCESS or FAILED is required...");
    let withdrawal = await withdrawalRepository.find(withdrawalId);
    if(!withdrawal)
        return createErrorResponse(res, "Withdrawal request not found");

    if(withdrawal.status == "SUCCESS"){
        const {userId, userType} = withdrawal;
        const [wallet, created] = await  walletRepository.findOrCreate({
            userId,
            userType
        },{
            userId,
            userType,
            balance: 0
        });

        if(created || wallet.balance < withdrawal.amount)
            return createErrorResponse(res, "Insufficient balance");


        wallet.balance -= withdrawal.amount;
        await  wallet.save();
    }
    withdrawal.status = status;
    withdrawal.reason = reason;
    withdrawal = await withdrawal.save();
    return createSuccessResponse(res, withdrawal, "Completed");
};