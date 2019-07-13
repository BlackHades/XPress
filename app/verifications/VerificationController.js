"use strict";
const Sequelize = require("sequelize");
const {validationResult } = require('express-validator/check');
const emailService = require("../../services/EmailService");
const smsService = require("../../services/SMSService");
const userRepository = require("../users/UserRepository");
const affiliateRepository = require("../affiliates/AffiliateRepository");
const verificationRepository = require("./VerificationRepository");
const debug = require("debug")("app:debug");
const moment = require("moment");
const Op = Sequelize.Op;
const {createErrorResponse, createSuccessResponse, validationHandler} = require("../../helpers/response");
exports.verify = async (req, res) => {
    //code and token

    const valFails = validationResult(req);
    if(!valFails.isEmpty())
        return createErrorResponse(res,validationHandler(valFails), valFails.array);

    const {code, type} = req.body;
    const userType = req.user ? "user" : "affiliate";
    let email, phoneNumber;
    if(type == "email"){
        if(userType == "user")
            email = req.user.email;
        else
            email = req.affiliate.email;
    }else{
        if(userType == "user")
            phoneNumber = req.user.phone;
        else
            phoneNumber = req.affiliate.phoneNumber;
    }

    const t30 = moment().utc().subtract(30, "minute").toISOString();
    debug("Timestamp", t30);
    const verification = await verificationRepository.findOne({
        code,
        type,
        userType,
        value: type == "email" ? email : phoneNumber,
        createdAt: {[Op.gte]: t30}
    });

    if(!verification)
        return createErrorResponse(res, "Invalid Verification Code");

    await verification.destroy();

    let query,user;
    if(type == "email")
        query = {email};
    if(type == "phoneNumber"){
        if(userType == "user")
            query = {phone: phoneNumber};
        else
            query = {phoneNumber};
    }
    if(userType == "user")
        user = await userRepository.findOne(query);

    else
        user = await affiliateRepository.findOne(query);

    if(!user)
        return createErrorResponse(res, "User not found");
    if(type == "email")
        user.emailVerifiedAt = moment.now();
    else
        user.phoneVerifiedAt = moment.now();

    user = await user.save();

    return createSuccessResponse(res, user);
};


exports.resend = (req, res) => {

};


