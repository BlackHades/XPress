'use strict';
const {validationResult } = require('express-validator/check');
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const cardRepository = require('./CardRepository');
const log = require("../../../helpers/Logger");

/**
 * Create Cards
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const create = async (req,res,next) => {
    try{
        //Validate Payload
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        //Extract Body
        let payload = req.body;
        log("Card Payload: " + JSON.stringify(payload));
        let card = await cardRepository.create({
            name: payload.name,
            description: payload.description,
            country:payload.country,
            type:payload.type,
            priceRange: payload.priceRange,
            amount: payload.amount
        });
        log("Card: " + JSON.stringify(card));
        return createSuccessResponse(res, card, "Card Created");
    }catch (e) {
        next(e);
    }
};


const destroy = (req, res, next) => {
    // Delete from Card Information too
    //Delete all relationship...No wasting time
};

/**
 * Update Cards
 * @param req
 * @param res
 * @param next
 * @returns {void|*}
 */
const update = async (req, res, next) => {
    try{
        //Validate Payload
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        //Extract Body
        let payload = req.body;
        const cardId = req.params.cardId;
        log("CardId: " + cardId);
        log("Card Payload: " + JSON.stringify(payload));
        let card = await cardRepository.update({
            name: payload.name,
            description: payload.description,
            country:payload.country,
            type:payload.type,
            priceRange: payload.priceRange,
            amount: payload.amount
        }, cardId);
        log("Card: " + JSON.stringify(card));
        return createSuccessResponse(res, payload, "Card Updated");
    }catch (e) {
        next(e);
    }
};

/**
 * Fetch All Users
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const all = async (req, res, next) => {
    return createSuccessResponse(res, await cardRepository.all());
};


module.exports = {
  create, destroy, update, all
};