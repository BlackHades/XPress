"use strict";
const {createSuccessResponse, createErrorResponse, validationHandler, formatPhone} = require('../../helpers/response');
const {validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const log = require("../../helpers/Logger");
const debug = require("debug")("app:debug");
const affiliateRepository = require("./AffiliateRepository");
const emailService = require("../../services/EmailService");
const verificationRepository = require("../verifications/VerificationRepository");
const smsService = require("../../services/SMSService");
const messages =  require("../../helpers/Messages");
exports.create = async (req, res, next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;
        payload.phoneNumber = formatPhone(payload.phoneNumber);
        payload.password = bcrypt.hashSync(payload.password, bcrypt.genSaltSync(10));
        let affiliates =  await affiliateRepository.create(payload);
        createSuccessResponse(res, affiliates);


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

        emailService.send(emailVerification.value, messages.affiliateEmailVerification(emailVerification.code), affiliates.name, "Confirm Your Email")
            .then(res => debug(res))
            .catch(err => {
                debug("Err");
                debug("Err", err.response.body);
                console.log("rr",err);
            });


        let phoneMessage = messages.phoneNumberVerification(affiliates.username, phoneVerification.code);
        smsService.send(affiliates.phoneNumber, phoneMessage)
            .then(res => debug("RES", res))
            .catch(err => debug("Err", err));

        
        //send email code and sms code
    }catch (e) {
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
    affiliate = await affiliate.save();
    createSuccessResponse(res, affiliate, "Status Successfully Changed");

    if(affiliate.status == "approved"){
        emailService.send(affiliate.email, messages.affiliateEmailApproval(), affiliate.username, "Account Approval")
            .then(res => debug("Res", res))
            .catch(err => debug(err));
    }else{
        emailService.send(affiliate.email, messages.affiliateEmailRejection(), affiliate.username, "Account Rejection", )
            .then(res => debug("Res", res))
            .catch(err => debug(err));
    }
};


