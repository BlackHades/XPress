"use strict";

const {createSuccessResponse, createErrorResponse} = require("../../../helpers/response");
const smsService = require("../../../services/SMSService");
const debug = require("debug")("app:debug");

exports.send = (req, res) => {
    const {to, message} = req.body;
    if(!message)
        return createErrorResponse(res, "Message is required");
    if(!to)
        return createErrorResponse(res, "At least one recipient is required");
    smsService.send(to, message)
        .then(response => debug("Single", response))
        .catch(err => debug("ErrorSingle", err));
    return createSuccessResponse(res, null,"SMS Sent");
};