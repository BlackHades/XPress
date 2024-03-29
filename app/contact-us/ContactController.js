'use strict';
const {validationResult } = require('express-validator/check');
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../helpers/response');

const contactRepository = require('./ContactRepository');
const log = require("../../helpers/Logger");


/**
 * Create Cards
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
exports.save = async (req,res,next) => {
    try{
        //Validate Payload
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        //Extract Body
        let payload = req.body;
        log("Contact Payload: " + JSON.stringify(payload));
        let contact = await contactRepository.create(payload);
        log("contact: " + JSON.stringify(contact));
        return createSuccessResponse(res, contact, "Message Saved");
    }catch (e) {
        next(e);
    }
};


exports.fetch = async (req,res,next) => {
    return createSuccessResponse(res, await contactRepository.fetch(),"Contacts Fetched")
};