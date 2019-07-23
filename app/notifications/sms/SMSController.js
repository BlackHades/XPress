"use strict";

const {createSuccessResponse, createErrorResponse} = require("../../../helpers/response");
const smsService = require("../../../services/SMSService");
const debug = require("debug")("app:debug");
const smsRepository = require("./SMSRepository");

exports.send = async (req, res) => {
    const {to, message} = req.body;
    if(!message)
        return createErrorResponse(res, "Message is required");
    if(!to)
        return createErrorResponse(res, "At least one recipient is required");
    let manyTo = to.split(",");
    debug(manyTo);
    let query = manyTo.map(t => {
        return {
            to: t,
            message: message
        }
    });

    await smsRepository.bulkCreate(query);
    smsService.send(to, message)
        .then(response => debug("Single", response))
        .catch(err => debug("ErrorSingle", err));
    return createSuccessResponse(res, null,"SMS Sent");
};


exports.fetch = async (req,res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    return createSuccessResponse(res, await smsRepository.paginate({},page,limit))
};