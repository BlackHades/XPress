"use strict";
const {createSuccessResponse, createErrorResponse, validationHandler} = require("../../helpers/response");
const debug = require("debug")("app:debug");
const {validationResult} = require('express-validator/check');
const bankAccountRepository = require("./BankAccountRepository");

exports.fetch = async (req, res) => {
    let bankAccount, query = {};
    if(req.affiliate){
        query = {
            userId: req.affiliate.id,
            userType: "affiliate"
        };

        bankAccount = await bankAccountRepository.findOne(query);
    }else{
        bankAccount = await bankAccountRepository.paginate(query, req.query.page || 1, req.query.limit || 100);
    }
    return createSuccessResponse(res, bankAccount);
};

exports.save = async (req, res) => {
    const valFails = validationResult(req);
    if (!valFails.isEmpty())
        return createErrorResponse(res, validationHandler(valFails), valFails.array);

    const {userId, userType, bankName, accountName, accountNumber} = req.body;

    const userTypeOptions = ["user", "affiliate"];

    if (!userTypeOptions.includes(userType))
        return createErrorResponse(res, "Invalid user type");


    let [bankAccount, created] = await bankAccountRepository.findOrCreate({
        userId,
        userType
    }, {
        userId,
        userType,
        bankName,
        accountName,
        accountNumber
    });

    if (!created) {
        bankAccount.accountName = accountName;
        bankAccount.accountNumber = accountNumber;
        bankAccount.bankName = bankName;
        bankAccount = await bankAccount.save();
    }

    debug("Herem,,,");
    return createSuccessResponse(res, bankAccount, "saved");
};