'use strict';
const {validationResult } = require('express-validator/check');
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../helpers/response');

const cardRepository = require('./CardRepository');
const log = require("../../helpers/Logger");
const cache = require("../../services/CacheManager");
const cacheKey = "cards";
const bitcoinRepository = require("../bitcoins/BitcoinRepository");

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
            name: payload.name.charAt(0).toUpperCase() + payload.name.slice(1),
            avatar: payload.avatar,
            description: payload.description,
            country:payload.country.toUpperCase(),
            type:payload.type,
            priceRange: payload.priceRange,
            amount: payload.amount,
            affiliateCharge: payload.affiliateCharge,
            superAffiliateCharge: payload.superAffiliateCharge
        });
        log("Card: " + JSON.stringify(card));
        return createSuccessResponse(res, card, "Card Created");
    }catch (e) {
        next(e);
    }
};


const destroy = (req, res, next) => {
    //delete all cards and transaction attached to it
    const cardId = req.params.cardId;
    if(!isNaN(cardId)){
        //delete all relationships here
        cardRepository.destroy(cardId);
    }

    return createSuccessResponse(res,null,"Card Deleted Successfully");
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
        let card = await cardRepository.update({
            name: payload.name.charAt(0).toUpperCase() + payload.name.slice(1),
            avatar: payload.avatar,
            description: payload.description,
            country:payload.country.toUpperCase(),
            type:payload.type,
            priceRange: payload.priceRange,
            amount: payload.amount
        }, cardId);
        return createSuccessResponse(res, payload, "Card Updated");
    }catch (e) {
        next(e);
    }
};

/**
 * Fetch All Cards
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const all = async (req, res, next) => {
    return createSuccessResponse(res, {
        card: await cardRepository.all(),
        bitcoin: await bitcoinRepository.fetch()
    });
};

/**
 * Fetch All Available Cards
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const available = async (req, res, next) => {
    return createSuccessResponse(res, {
        card: await cardRepository.available(),
        bitcoin: await bitcoinRepository.fetch()
    });
};
/**
 * Get Card By ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const show = async (req, res, next) => {
    let cardId = req.params.cardId;
    if(isNaN(cardId))
        return createErrorResponse(res,"Invalid Card Id");

    return createSuccessResponse(res, await cardRepository.find(cardId));
};

/**
 * Group cards by name
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const groupCardsByName = async (req,res,next) => {
    try{
        //get all cards/
        //loop through and put new data in an array
        let cards = await cache.getAsync(`${cacheKey}:name`);
        if(cards)
            return createSuccessResponse(res, JSON.parse(cards));

        const result = await cardRepository.available();
        cards = {};
        for(let i = result.length; i > 0; i--){
            let j = i-1;
            //group cards by their name
            let card = cards[result[j].name] !== undefined ?  cards[result[j].name]: [];
            card.push(result[j]);
            cards[result[j].name] = card;
        }
        cache.setAsync(`${cacheKey}:name`, JSON.stringify(cards));
        return createSuccessResponse(res, cards, "Cards Fetched");
    }catch (e) {
        next(e);
    }
};

/**
 * Toggle Availability
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const toggleAvailability = async (req, res, next) =>{
    try{
        let card = await cardRepository.find(req.params.cardId);
        log("Cards: " + JSON.stringify(card));
        if(card){
            //update The isAvailable column
            await cardRepository.update({isAvailable: card.isAvailable === "0" || !card.isAvailable}, card.id);

            //return data
            card.isAvailable = card.isAvailable === "0" || !card.isAvailable;
            return createSuccessResponse(res,card,"Card Updated");
        }else{
            return createErrorResponse(res,"Card Not Found");
        }
    }catch (e) {
        next(e);
    }
};
module.exports = {
  create, destroy, update, all, show, groupCardsByName, toggleAvailability, available
};