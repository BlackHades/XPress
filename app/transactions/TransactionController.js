"use strict";

const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../helpers/response'),
    {validationResult} = require('express-validator/check'),
    transactionRepository = require("./TransactionRepository"),
    transactionConstant = require("./TransactionConstant"),
    log = require("../../helpers/Logger"),
    role = require("../users/UserConstant"),
    cardRepository = require('../cards/CardRepository'),
    bitcoinRepository = require('../bitcoins/BitcoinRepository'),
    debug = require("debug")("app:debug"),
    {listener, TRANSACTION_COMPLETED} = require("../Listeners/TransactionCompletedListener"),
    {filter, sumBy} = require("lodash");
/**
 * Create Transactions
 * @param req
 * @param res
 * @param next
 * @returns {void|*}
 */

const create = async (req, res, next) => {
    try {


        debug("Here");

        //Validate Request
        const valFails = validationResult(req);

        //return error is validation fails
        if (!valFails.isEmpty())
            return createErrorResponse(res, validationHandler(valFails), valFails.array);

        //check for bitcoin or cardId
        let creatorId = req.user.id;
        let payload = req.body;
        let card, bitcoin, affiliateCharge, superAffiliateCharge;

        //If transaction is a card transaction
        if (payload.transactionType === transactionConstant.TYPE_CARD) {
            if (!payload.cardId)
                return createErrorResponse(res, "Card Id Is Required");
            card = await cardRepository.find(payload.cardId);
            if (!card || !card.isAvailable)
                return createErrorResponse(res, "Card Not Found or Card Is Not Available");

            affiliateCharge = card.affiliateCharge;
            superAffiliateCharge = card.superAffiliateCharge;
        }

        //If transaction is a bitcoin transaction
        if (payload.transactionType === transactionConstant.TYPE_BITCOIN) {
            if (!payload.bitcoinId)
                return createErrorResponse(res, "Bitcoin Id Is Required");
            bitcoin = await bitcoinRepository.find(payload.bitcoinId);
            if (!bitcoin)
                return createErrorResponse(res, "Bitcoin Not Found");


            affiliateCharge = bitcoin.affiliateCharge;
            superAffiliateCharge = bitcoin.superAffiliateCharge;
        }

        payload.createdBy = creatorId;
        payload.status = payload.mode == "WALLET" && payload.status == "SUCCESSFUL" ? "PENDING" : payload.status;
        payload.transactionId = await transactionRepository.generateTransactionId();
        const transaction = await transactionRepository.create(payload);
        transaction.dataValues.bitcoin = bitcoin;
        transaction.dataValues.card = card;
        createSuccessResponse(res, transaction, "Transaction Completed");

        if(payload.mode != transactionConstant.MODE_WALLET){
            listener.emit(TRANSACTION_COMPLETED, {
                transaction,
                charge: {
                    affiliateCharge,
                    superAffiliateCharge
                }
            });
        }
    } catch (e) {
        next(e);
    }
};


const all = async (req, res, next) => {
    let transactions;
    if (req.user.roleId === role.ADMINISTRATOR)
        transactions = await transactionRepository.getAllTransactions();
    if (req.user.roleId === role.AGENT)
        transactions = await transactionRepository.getAgentTransaction(req.user.id);
    if (req.user.roleId === role.USER)
        transactions = await transactionRepository.getUserTransaction(req.user.id);


    return createSuccessResponse(res, transactions, "Transaction Fetched");
};

const destroy = (req, res, next) => {
    const transactionId = req.params.transactionId;
    log("TransactionId: " + transactionId);
    if (transactionId !== undefined)
        transactionRepository.destroy(transactionId);
    return createSuccessResponse(res, null, "Transaction Deleted");
};

const show = (req, res, next) => {
    transactionRepository.find(req.params.transactionId)
        .then(transaction => {
            if (req.user.roleId === role.ADMINISTRATOR
                || transaction.userId === req.user.id
                || transaction.createdBy === req.user.id)
                return createSuccessResponse(res, transaction, "Transaction Fetched");
            else
                return createErrorResponse(res, "Unauthorized");
        }).catch(error => {
        next(error);
    });
};
const details = async (req, res, next) => {
    try {
        let transactions = {};
        if (req.user.roleId === role.ADMINISTRATOR)
            transactions = await transactionRepository.getAllTransactions();
        if (req.user.roleId === role.AGENT)
            transactions = await transactionRepository.getAgentTransaction(req.user.id);
        if (req.user.roleId === role.USER)
            transactions = await transactionRepository.getUserTransaction(req.user.id);


        const response = {};

        const success = filter(transactions, (transaction) => transaction.status == "SUCCESSFUL");
        response.success = {
            count: success.length,
            amount: sumBy(success, (transaction) => parseFloat(transaction.amount))
        };
        const failed = filter(transactions, (transaction) => transaction.status == "FAILED");
        response.failed = {
            count: failed.length,
            amount: sumBy(failed, (transaction) => parseFloat(transaction.amount))
        };

        const pending = filter(transactions, (transaction) => transaction.status == "PENDING");
        response.pending = {
            count: pending.length,
            amount: sumBy(pending, (transaction) => parseFloat(transaction.amount))
        };
        response.total = {
            count: transactions.length,
            amount: sumBy(transactions, (transaction) => parseFloat(transaction.amount))
        };
        console.log("total", response);
        return createSuccessResponse(res, response);

    } catch (error) {
        next(error);
    }
};



const status = async (req, res, next) => {
    try{
        const {status, transactionId} = req.query;
        const allStatus = ["SUCCESSFUL", "FAILED"];
        if(!allStatus.includes(status))
            return createErrorResponse(res, "Invalid Status");
        if(!transactionId)
            return createErrorResponse(res, "Transaction Id is required");

        let transaction = await transactionRepository.find(transactionId);
        if(!transaction)
            return createErrorResponse(res, "Transaction Not Found");

        if(transaction.status != "PENDING")
            return createErrorResponse(res, "This transaction has been resolved...");
        transaction.status = status;
        transaction.approvedBy = req.user.id;
        transaction = await transaction.save();

        createSuccessResponse(res, transaction, "Transaction Status Updated");

        let card, bitcoin, affiliateCharge, superAffiliateCharge;

        //If transaction is a card transaction
        if (transaction.transactionType === transactionConstant.TYPE_CARD) {
            if (!transaction.cardId)
                return;
            card = await cardRepository.find(transaction.cardId);
            if (!card || !card.isAvailable)
                return;

            affiliateCharge = card.affiliateCharge;
            superAffiliateCharge = card.superAffiliateCharge;
        }

        //If transaction is a bitcoin transaction
        if (transaction.transactionType === transactionConstant.TYPE_BITCOIN) {
            if (!transaction.bitcoinId)
                return;
            bitcoin = await bitcoinRepository.find(transaction.bitcoinId);
            if (!bitcoin)
                return;


            affiliateCharge = bitcoin.affiliateCharge;
            superAffiliateCharge = bitcoin.superAffiliateCharge;
        }

        debug("Here", superAffiliateCharge, affiliateCharge);

        listener.emit(TRANSACTION_COMPLETED, {
            transaction,
            charge: {
                affiliateCharge,
                superAffiliateCharge
            }
        });


    }catch (e) {
        debug(e);
        return next(e);
    }
};

const leaderboards = async (req, res, next) => {
    let leaderboard = {}
        const {userId} = req.params;
        try{
            const leaderBoardByAmount = await transactionRepository.getLeaderbaords('Amount')
            const leaderBoardByCount = await transactionRepository.getLeaderbaords('Count')
            leaderboard.byAmount = leaderBoardByAmount;
            leaderboard.byCount = leaderBoardByCount
            if(userId){
               let userDetails = await transactionRepository.getLeaderbaords('User', userId)
                leaderboard.user = userDetails
            }
            return createSuccessResponse(res, leaderboard);
        }catch (e) {
       console.log("error --> e")
        return next(e);
    }
}


module.exports = {
    create,
    all,
    destroy,
    show,
    details,
    status,
    leaderboards
};