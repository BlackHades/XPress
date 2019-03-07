"use strict";

const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response'),
    {validationResult } = require('express-validator/check'),
    transactionRepository = require("./TransactionRepository"),
    log = require("../../../helpers/Logger"),
    role = require("../../api/users/UserConstant");
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

        //Extract Data
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


const all = async (req,res,next) => {
    let transactions;
    if(req.user.roleId === role.ADMINISTRATOR)
        transactions = await transactionRepository.getAllTransactions();
    if(req.user.roleId === role.AGENT)
        transactions = await transactionRepository.getAgentTransaction(req.user.id);
    if(req.user.roleId === role.USER)
        transactions = await transactionRepository.getUserTransaction(req.user.id);


    return createSuccessResponse(res,transactions,"Transaction Fetched");
};

const destroy = (req,res,next) => {
    const transactionId = req.params.transactionId;
    log("TransactionId: " + transactionId);
    if(transactionId !== undefined)
        transactionRepository.destroy(transactionId);
    return createSuccessResponse(res,null, "Transaction Deleted");
};

const show = (req, res, next) => {
    transactionRepository.find(req.params.transactionId)
        .then(transaction => {
            if(req.user.roleId === role.ADMINISTRATOR
                || transaction.userId === req.user.id
                || transaction.createdBy === req.user.id)
                return createSuccessResponse(res, transaction,"Transaction Fetched");
            else
                return createErrorResponse(res,"Unauthorized");
        }).catch(error => {
            next(error);
        });
};

module.exports = {
    create,
    all,
    destroy,
    show
};