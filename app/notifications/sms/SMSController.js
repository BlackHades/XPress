"use strict";

const {createSuccessResponse, createErrorResponse} = require("../../../helpers/response");
const smsService = require("../../../services/SMSService");
const debug = require("debug")("app:debug");
const smsRepository = require("./SMSRepository");

exports.send = async (req, res) => {
    debug("I AM here SMS-----------------------");
    let {to, message} = req.body;
    if(!message)
        return createErrorResponse(res, "Message is required");
    if(!to)
        return createErrorResponse(res, "At least one recipient is required");

    let manyTo = to;
    if(to instanceof Array){
        manyTo = to;
        to = to.join();
    }else{
        manyTo = to.split(",");
    }
    debug(manyTo.length);
    let query = manyTo.map(t => {
        return {
            to: t,
            message: message
        }
    });

    await smsRepository.bulkCreate(query);
    const allSMS = manyTo;
    let length = 199;
    while(allSMS.length) {
        const data = allSMS.splice(0,length);
        debug(data.length, data.join());
        smsService.send(data.join(), message)
            .then(response => debug("SMS", response.data))
            .catch(err => debug("ErrorSingle", err.response));
    }

    return createSuccessResponse(res, null,"SMS Sent");
};


exports.fetch = async (req,res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    return createSuccessResponse(res, await smsRepository.paginate({},page,limit))
};