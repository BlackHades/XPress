"use strict";

const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response'),
    {validationResult } = require('express-validator/check'),
    transactionRepository = require("./TransactionRepository"),
    log = require("../../../helpers/Logger");
/**
 * Create Transactions
 * @param req
 * @param res
 * @param next
 * @returns {void|*}
 */

const create = async (req, res, next) => {
    try{

        //Validate Request
        const valFails = validationResult(req);

        //return error is validation fails
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let creatorId = req.user.id;
        let payload = req.body;
        payload.createdBy = creatorId;
        payload.transactionId = await transactionRepository.generateTransactionId();

        const transaction = await transactionRepository.create(payload);
        log("Transactions: " + JSON.stringify(transaction));
        return createSuccessResponse(res, transaction, "Transaction Completed");
    } catch (e) {
        next(e);
    }
};



module.exports = {
    create
};