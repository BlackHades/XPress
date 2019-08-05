"use strict";

const {createSuccessResponse, createErrorResponse} = require("../../../helpers/response");
const emailService = require("../../../services/EmailService");
const debug = require("debug")("app:debug");
const mailerRepository = require("./MailRepository");
exports.send = async (req, res) => {
    let {to, subject, message, from} = req.body;
    from = from || "no-reply@chiji14xchange.com";
    if(!message)
        return createErrorResponse(res, "Message is required");
    if(Array.isArray(to)){
        if(to.length == 0)
            return createErrorResponse(res, "At least one recipient is required");

        let query = to.map(t => {
           return {
               to: t,
               from: from,
               subject: subject || "No Subject",
               message: JSON.stringify(message)
           }
        });

        await mailerRepository.bulkCreate(query);

        debug("email length", to.length);
        emailService.sendMultiple(to, subject, message, from)
            .then(response => debug("Multiple", response))
            .catch(err => {
                debug("ErrorMultiple", {err});
                debug("ErrorMultiple", JSON.stringify(err));
                debug("ErrorMultiple", err.response.body.errors);
            });
    }else{
        if(!to)
            return createErrorResponse(res, "At least one recipient is required");

        await mailerRepository.create({
            to: to,
            from: from,
            subject: subject || "No Subject",
            message: JSON.stringify(message)
        });
        emailService.send(to, message,"", subject, from)
            .then(response => debug("Single", response))
            .catch(err => {
                debug("ErrorSingle", err);
                debug("ErrorSingle", JSON.stringify(err));
                debug("ErrorSingle", err.response.body.errors)
            });
    }
    return createSuccessResponse(res, null,"Email Sent");
};


exports.fetch = async (req,res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    return createSuccessResponse(res, await mailerRepository.get(page,limit))
};