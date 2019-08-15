"use strict";

const Emitter = require("events").EventEmitter;
const debug = require("debug")("app:debug");
const listener = new Emitter;
const TRANSACTION_COMPLETED = "emit-transaction-completed";
const userRepository = require("../users/UserRepository");
const affiliateRepository = require("../affiliates/AffiliateRepository");
const walletRepository = require("../wallets/WalletRepository");
const walletLogRepository = require("../wallet-logs/WalletLogRepository");
const transactionRepository = require("../transactions/TransactionRepository");


listener.on(TRANSACTION_COMPLETED, async ({transaction, charge : { affiliateCharge, superAffiliateCharge}}) => {
    debug("transaction-completed is triggered", transaction, affiliateCharge, superAffiliateCharge);
    if (transaction.status.toLowerCase() != "success" && transaction.status.toLowerCase() != "successful")
        return;

    const user = await userRepository.find(transaction.userId);
    if (!user)
        return;

    setImmediate(async () => {
        debug(affiliateCharge, superAffiliateCharge, transaction.quantity);
        const affiliate = await affiliateRepository.findOne({username: user.affiliateCode});
        if (!affiliate)
            return;

        const charge = affiliate.type == "super" ? transaction.quantity * superAffiliateCharge : transaction.quantity * affiliateCharge;
        let [wallet, created] = await walletRepository.findOrCreate({
            userId: affiliate.id,
            userType: "affiliate",
        }, {
            userId: affiliate.id,
            userType: "affiliate",
            balance: charge,
        });

        if (!created) {
            wallet.balance += charge;
            wallet = await wallet.save();
        }


        let log = await walletLogRepository.create({
            userId: affiliate.id,
            userType: "affiliate",
            amount: charge,
            description: `Commission on transaction ${transaction.transactionId}`,
            transactionId: transaction.transactionId
        });
        debug("completed", wallet, log);
    });


    setImmediate(async () => {
        debug(affiliateCharge, superAffiliateCharge, transaction.quantity);


        //get all user Past Transaction
        //check if total past transaction is >= referral amount
        //if true give referral
        //find a way to track the user who has gotten the referral

        const transactions = await transactionRepository.all({
            userId: transaction.userId,
            status: "SUCCESSFUL"
        });

        // const affiliate = await affiliateRepository.findOne({username: user.affiliateCode});
        // if (!affiliate)
        //     return;
        //
        // const charge = affiliate.type == "super" ? transaction.quantity * superAffiliateCharge : transaction.quantity * affiliateCharge;
        // let [wallet, created] = await walletRepository.findOrCreate({
        //     userId: affiliate.id,
        //     userType: "affiliate",
        // }, {
        //     userId: affiliate.id,
        //     userType: "affiliate",
        //     balance: charge,
        // });
        //
        // if (!created) {
        //     wallet.balance += charge;
        //     wallet = await wallet.save();
        // }
        //
        //
        // let log = await walletLogRepository.create({
        //     userId: affiliate.id,
        //     userType: "affiliate",
        //     amount: charge,
        //     description: `Commission on transaction ${transaction.transactionId}`,
        //     transactionId: transaction.transactionId
        // });
        // debug("completed", wallet, log);
    });

});



module.exports = {
    listener,
    TRANSACTION_COMPLETED
};