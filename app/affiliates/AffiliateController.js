"use strict";
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../helpers/response');
const {validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const log = require("../../helpers/Logger");
const debug = require("debug")("app:debug");
const affiliateRepository = require("./AffiliateRepository");
const emailService = require("../../services/EmailService");
exports.create = async (req, res, next) => {
    //validate
    //save
    //check if email is unique with the users table
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;
        debug(payload);
        //hash password
        const hashedPassword = bcrypt.hashSync(payload.password,  bcrypt.genSaltSync(10));
        debug(hashedPassword);

        payload.password = hashedPassword;
        let affiliates =  await affiliateRepository.create(payload);
        createSuccessResponse(res, affiliates);
        //send email code and sms code

    }catch (e) {
        // handler(e);
        next(e);
    }
};



exports.status = (req,res) => {
    //if accept, move to users and send email
    //else send rejection email
};


