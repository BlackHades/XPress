"use strict";

const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response'),
    {validationResult } = require('express-validator/check'),
    transactionRepository = require("./TransactionRepository"),
    transactionConstant = require("./TransactionConstant"),
    log = require("../../../helpers/Logger"),
    role = require("../../api/users/UserConstant"),
    cardRepository = require('../cards/CardRepository'),
    bitcoinRepository = require('../bitcoins/BitcoinRepository'),
    {filter,sumBy}= require("lodash");
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
        // return createSuccessResponse(res,req.body);


        //check for bitcoin or cardId
        let creatorId = req.user.id;
        let payload = req.body;
        let card,bitcoin;

        //If transaction is a card transaction
        if(payload.transactionType === transactionConstant.TYPE_CARD){
            if(!payload.cardId)
                return createErrorResponse(res,"Card Id Is Required");
            card = await cardRepository.find(payload.cardId);
            if(!card || !card.isAvailable)
                return createErrorResponse(res,"Card Not Found or Card Is Not Available");
        }

        //If transaction is a bitcoin transaction
        if(payload.transactionType === transactionConstant.TYPE_BITCOIN){
            if(!payload.bitcoinId)
                return createErrorResponse(res,"Bitcoin Id Is Required");
            bitcoin = await bitcoinRepository.find(payload.bitcoinId);
            if(!bitcoin)
                return createErrorResponse(res,"Bitcoin Not Found");
        }

        payload.createdBy = creatorId;
        payload.transactionId = await transactionRepository.generateTransactionId();
        const transaction = await transactionRepository.create(payload);
        transaction.dataValues.bitcoin = bitcoin;
        transaction.dataValues.card = card;
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


const details = async (req,res,next) => {
    try{
        let transactions = {};
        if(req.user.roleId === role.ADMINISTRATOR)
            transactions = await transactionRepository.getAllTransactions();
        if(req.user.roleId === role.AGENT)
            transactions = await transactionRepository.getAgentTransaction(req.user.id);
        if(req.user.roleId === role.USER)
            transactions = await transactionRepository.getUserTransaction(req.user.id);

        
        const response = {};

        const success = filter(transactions, (transaction) => transaction.status == "SUCCESSFUL");
        response.success = {
            count: success.length,
            amount: sumBy(success,(transaction) => parseFloat(transaction.amount))
        };
        const failed = _.filter(transactions, (transaction) => transaction.status == "FAILED");
        response.failed = {
            count: failed.length,
            amount: sumBy(failed,(transaction) => parseFloat(transaction.amount))
        };

        const pending = filter(transactions, (transaction) => transaction.status == "PENDING");
        response.pending = {
            count: pending.length,
            amount: sumBy(pending,(transaction) => parseFloat(transaction.amount))
        };
        response.total = {
            count:transactions.length,
            amount: _.sumBy(transactions,(transaction) => parseFloat(transaction.amount))
        };
        return createSuccessResponse(res, response);

    }catch(error){
        next(error);
    }
};

module.exports = {
    create,
    all,
    destroy,
    show,
    details
};