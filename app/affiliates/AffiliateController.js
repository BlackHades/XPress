"use strict";
const {createSuccessResponse, createErrorResponse, validationHandler, formatPhone} = require('../../helpers/response');
const {validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const debug = require("debug")("app:debug");
const affiliateRepository = require("./AffiliateRepository");
const verificationRepository = require("../verifications/VerificationRepository");
const emailService = require("../../services/EmailService");
const smsService = require("../../services/SMSService");
const messages =  require("../../helpers/Messages");
const jwt = require('jsonwebtoken');
const userRepository = require("../users/UserRepository");
const transactionRepository = require("../transactions/TransactionRepository");

exports.create = async (req, res, next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;
        payload.username = `_${payload.username}`;
        payload.phoneNumber = formatPhone(payload.phoneNumber);
        payload.password = bcrypt.hashSync(payload.password, bcrypt.genSaltSync(10));
        let affiliate =  await affiliateRepository.create(payload);
        const access = jwt.sign({affiliate}, process.env.SECURITY_KEY, {
            expiresIn: 86400 * 2 // expires in 48 hours if its not from a mobile device else 30 days
        });

        const refresh = jwt.sign({affiliateId: affiliate.id}, process.env.SECURITY_KEY, {
            expiresIn: 86400 * 100 // expires in 30days
        });

        delete affiliate.dataValues.password;

        createSuccessResponse(res, {
            affiliate,
            token: {
                access: access,
                refresh: refresh
            }
        }, "Application Submitted Successfully");


        const emailVerification = {
            code: verificationRepository.generateCode(),
            type: "email",
            userType: "affiliate",
            value: payload.email
        };


        const phoneVerification = {
            code: verificationRepository.generateCode(),
            type: "phoneNumber",
            userType: "affiliate",
            value: payload.phoneNumber
        };

        await verificationRepository.bulkCreate([
            emailVerification,
            phoneVerification
        ],{returning: true});

        emailService.send(
            emailVerification.value,
            messages.affiliateEmailVerification(emailVerification.code),
            affiliate.name,
            "Confirm Your Email")
            .then(res => debug(res))
            .catch(err => {
                debug("Err");
                debug("Err", err.response.body);
                console.log("rr",err);
            });


        let phoneMessage = messages.phoneNumberVerification(affiliate.username, phoneVerification.code);
        smsService.send(affiliate.phoneNumber, phoneMessage)
            .then(res => debug("RES", res))
            .catch(err => debug("Err", err));
    }catch (e) {
        debug("Error", e);
        // handler(e);
        next(e);
    }
};

exports.status = async (req,res) => {
    let allStatus = ["rejected","approved"];
    const {status, affiliateId, message} = req.query;

    if(!allStatus.includes(status))
        return createErrorResponse(res, "Unknown status", null);

    if(!affiliateId)
        return createErrorResponse(res, "Affiliate identifier not found.");

    let affiliate = await affiliateRepository.find(affiliateId);

    if(!affiliate)
        return createErrorResponse(res, "Affiliate not found");

    if(status == affiliate.status)
        return createSuccessResponse(res, affiliate, "Status Successfully Changed");

    affiliate.status = status.toLowerCase();

    affiliate.approvedBy = req.user.id;

    affiliate = await affiliate.save();

    createSuccessResponse(res, affiliate, "Status Successfully Changed");

    if(affiliate.status == "approved"){
        emailService.send(affiliate.email, message || messages.affiliateEmailApproval(), affiliate.username, "Account Approval")
            .then(res => debug("Res", res))
            .catch(err => debug("Error", err));
    }else{
        emailService.send(affiliate.email, message || messages.affiliateEmailRejection(), affiliate.username, "Account Rejection", )
            .then(res => debug("Res", res))
            .catch(err => debug("Err", err));
    }
};

exports.changeAffiliateActiveStatus = async (req, res) => {
    const isActiveOption = [0,1];
    const { affiliateId, isActive} = req.body;
    if(!isActiveOption.includes(isActive))
        return createErrorResponse(res, "IsActive Option is invalid. 1 or 0 is required as (true of false)");
    let affiliate = await affiliateRepository.find(affiliateId);
    if(!affiliate)
        return createErrorResponse(res, "Affiliate not found");

    affiliate.isActive = isActive;
    affiliate = await affiliate.save();
    return createSuccessResponse(res, affiliate, "Process Completed");
};

exports.changeAffiliateType = async (req, res) => {
    const typeOption = ["normal","super"];
    const { affiliateId, type} = req.body;
    if(!typeOption.includes(type))
        return createErrorResponse(res, "Type Option is invalid.");
    let affiliate = await affiliateRepository.find(affiliateId);
    if(!affiliate)
        return createErrorResponse(res, "Affiliate not found");

    affiliate.type = type;
    affiliate = await affiliate.save();
    return createSuccessResponse(res, affiliate, "Process Completed");
};

exports.me = async (req,res) => {
    const affiliate = await affiliateRepository.find(req.affiliate.id);
    return createSuccessResponse(res, affiliate);
};

exports.all = async (req, res) => {
    const affiliates = await  affiliateRepository.all();
    return createSuccessResponse(res, affiliates);
};

exports.users = async (req, res) => {
    const affiliateId = res.affiliate && res.affiliate.id || req.query.affiliateId;
    let affiliate;
    if(res.affiliate)
        affiliate = res.affiliate;

    if(!affiliate){
        if(!req.query.affiliateId)
            return createErrorResponse(res,"Affiliate Identifier not found");
        affiliate = await affiliateRepository.find(req.query.affiliateId);
        if(!affiliate)
            return createErrorResponse(res, "Affiliate Not Found");
    }
    const users = await userRepository.findAll({affiliateCode: affiliate.username});
    debug(users);
    return createSuccessResponse(res, users);

};
