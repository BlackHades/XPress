"use strict";
const {createSuccessResponse, createErrorResponse, validationHandler} = require("../../helpers/response");
const debug = require("debug")("app:debug");
const {validationResult} = require('express-validator/check');
const userRepository = require("../users/UserRepository");
const affiliateRepository = require("../affiliates/AffiliateRepository");
const walletRepository = require("./WalletRepository");
const walletLogRepository = require("../wallet-logs/WalletLogRepository");

exports.fetch = (req, res) => {

};


exports.increase = async (req, res) => {
    const valFails = validationResult(req);
    if (!valFails.isEmpty())
        return createErrorResponse(res, validationHandler(valFails), valFails.array);

    const {userId, userType, amount, description} = req.body;
    const userTypeOptions = ["user", "affiliate"];
    if (!userTypeOptions.includes(userType))
        return createErrorResponse(res, "Invalid user type");

    let user;
    if (userType == "user")
        user = await userRepository.find(userId);
    if (userType == "affiliate")
        user = await affiliateRepository.find(userId);

    if (!user)
        return createErrorResponse(res, `${userType} not found`);

    let [wallet, created] = await walletRepository.findOrCreate({
        userId,
        userType
    }, {
        userId,
        userType,
        balance: amount,
    });

    if (!created) {
        wallet.balance += amount;
        wallet = await wallet.save();
    }

    let log = await walletLogRepository.create({
        userId,
        userType,
        amount,
        description
    });

    wallet.dataValues.log = log;
    return createSuccessResponse(res, wallet, "Completed");
};