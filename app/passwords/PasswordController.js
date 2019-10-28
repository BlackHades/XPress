"use strict";
const { createSuccessResponse, createErrorResponse, validationHandler } = require('../../helpers/response');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const { User } = require('../../database/sequelize');
const jwt = require('jsonwebtoken');
const { fetchByEmail, updateUser } = require('../users/UserRepository');
const sendGrid = require("@sendgrid/mail");
const debug = require("debug")("app:debug");
const emailService = require("../../services/EmailService");
const affiliateRepository = require("../affiliates/AffiliateRepository");
const messages = require("../../helpers/Messages");
const moment = require("moment");
exports.change = async (req, res, next) => {
    try {
        const valFails = validationResult(req);
        if (!valFails.isEmpty())
            return createErrorResponse(res, validationHandler(valFails), valFails.array);

        let payload = req.body;
        let user = req.user;

        console.log('payload => ', payload);

        //Compare oldPassword to Users Password
        if (!bcrypt.compare(payload.oldPassword, user.password))
            return createErrorResponse(res, "Current Password is invalid");

        //Hash New Password
        const hashedPassword = bcrypt.hashSync(payload.newPassword, bcrypt.genSaltSync(10));

        user.password = hashedPassword;

        console.log('hashedPassword -> ', hashedPassword);

        //Update Database
        await updateUser({ password: hashedPassword }, user.id);

        //return response
        return createSuccessResponse(res, user, "Password Changed Successfully");
    } catch (e) {
        console.log(e)
        next(e);
    }
};
exports.reset = async (req, res, next) => {
    try {
        const valFails = validationResult(req);
        if (!valFails.isEmpty())
            return createErrorResponse(res, validationHandler(valFails), valFails.array);
        let payload = req.body;
        let decoded;
        try {
            decoded = jwt.verify(payload.token, process.env.SECURITY_KEY);
        } catch (e) {
            debug(e);
            decoded = null;
        }
        if (!decoded)
            return createErrorResponse(res, "Invalid Token");
        debug("Debug", decoded);
        const { email, type } = decoded;
        //Fetch User by email
        let user;
        if (type && type == "affiliate")
            user = await affiliateRepository.findOne({ email });
        else
            user = await fetchByEmail(email);
        if (!user)
            return createErrorResponse(res, "User Not Found");

        // Hash New Password
        const hashedPassword = bcrypt.hashSync(payload.newPassword, bcrypt.genSaltSync(10));

        user.password = hashedPassword;
        //Update Database
        user.password = hashedPassword;
        if (!user.emailVerifiedAt)
            user.emailVerifiedAt = moment();
        user = await user.save();
        //return response
        return createSuccessResponse(res, user, "Password Reset Successful");
    } catch (e) {
        next(e);
    }
};

exports.send = async (req, res) => {
    let { email, type, redirectUrl } = req.query;
    if (!email)
        return createErrorResponse(res, "Email Not Found");
    type = type || "user";
    let user;
    if (type && type == "affiliate")
        user = await affiliateRepository.findOne({ email });
    else
        user = await fetchByEmail(email);

    if (!user)
        return createErrorResponse(res, "Account Not Found");

    createSuccessResponse(res, null, "Email Sent");

    const token = jwt.sign({ email, type }, process.env.SECURITY_KEY, {
        expiresIn: (86400) // expires in 1day
    });

    let url = "http://chiji14xchange.com/reset-password?token=";
    url = (redirectUrl || url) + token;
    emailService.send(email, messages.passwordReset(url), user.name, "Password Reset")
        .then(res => {
            debug("Res", res);
            console.log("Res", res);
        })
        .catch(err => {
            debug("Err", err);
            console.log("Err", err);
        });
};