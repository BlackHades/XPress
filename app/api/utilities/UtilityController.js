'use strict';
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {fetchByKey, fetchAll, upsert} = require("../utilities/UtilityRepository");
const log = require("../../../helpers/Logger");


/**
 * This method create or update a key with a value
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
exports.upsert = async (req, res, next) => {
    return createSuccessResponse(res, await upsert(req.body.key, JSON.stringify(req.body.value)))
};


exports.fetch = async (req, res, next) => {
    try{
        let key = req.params.key || null;
        if(!key)
            return createSuccessResponse(res, await fetchAll());
        else
            return createSuccessResponse(res,await fetchByKey(key));
    }catch(e){
        log(e);
        return createSuccessResponse(res, await fetchAll());
    }
};