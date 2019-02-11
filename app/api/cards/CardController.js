'use strict';
const {validationResult } = require('express-validator/check');
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const cardRepository = require('./CardRepository');
const create = async (req,res,next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;
        const hashedPassword = bcrypt.hashSync(payload.password,  bcrypt.genSaltSync(10));
        console.log("hashedPassword: " + hashedPassword);
        let card = await cardRepository.create({
            name: payload.name,
            description: payload.description
        });
        console.log("Card: " + JSON.stringify(card));
        return createSuccessResponse(res, card, "Card Created");
    }catch (e) {
        // handler(e);
        next(e);
    }
};


const destroy = (req, res, next) => {
    // Delete from Card Information too
    //Delete all relationship...No wasting time
};


const update = (req, res, next) => {

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