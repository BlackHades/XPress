
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');
const bitcoinRepository = require("./BitcoinRepository");

//CREATE
//fetch
//update
//delete

/**
 * Create Bitcoin
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const create = async (req,res,next) =>{
    try{
        //validate
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let bitcoin = await bitcoinRepository.create(req.body);
        return createSuccessResponse(res, bitcoin,"Bitcoin Created");
    }catch (e) {
        next(e);
    }
};


/**
 * Fetch Bitcoin
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const fetch = async (req,res,next) => {
    return createSuccessResponse(res, await bitcoinRepository.fetch());
};


const find = async (req,res,next) => {
    return createSuccessResponse(res, await  bitcoinRepository.find(req.params.bitcoinId));
};

/**
 * Update Bitcoin Value
 * @param req
 * @param res
 * @param next
 * @returns {void|*}
 */
const update = async (req, res, next) => {
    try{
        //validate
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);
        await bitcoinRepository.update(req.body, req.params.bitcoinId);

        return createSuccessResponse(res, null, "Bitcoin Has been updated");
    }catch (e) {
        next(e);
    }
};


const destroy = async (req,res,next) => {
    try{
        await bitcoinRepository.destroy(req.params.bitcoinId);
        return createSuccessResponse(res);
    }catch (e) {
        next(e);
    }
};
module.exports = {
    create,
    update,
    fetch,
    destroy,
    find
};