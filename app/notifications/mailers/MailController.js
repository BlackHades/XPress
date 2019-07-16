"use strict";

const {createSuccessResponse, createErrorResponse} = require("../../../helpers/response");
const emailService = require("../../../services/EmailService");
const debug = require("debug")("app:debug");

exports.send = (req, res) => {
    const {to, subject, message, from} = req.body;
    if(!message)
        return createErrorResponse(res, "Message is required");
    if(Array.isArray(to)){
        if(to.length == 0)
            return createErrorResponse(res, "At least one recipient is required");
        emailService.sendMultiple(to, subject, message, from || "no-reply@chiji14xchange.com")
            .then(response => debug("Multiple", response))
            .catch(err => debug("ErrorMultile", err));
    }else{
        if(!to)
            return createErrorResponse(res, "At least one recipient is required");
        emailService.send(to, message,"", subject, from || "no-reply@chiji14xchange.com")
            .then(response => debug("Single", response))
            .catch(err => debug("ErrorSingle", err));
    }
    return createSuccessResponse(res, null,"Email Sent");
};