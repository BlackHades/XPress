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
const utilityRepository = require("../utilities/UtilityRepository");
const {_sumArrayOfObject} = require("../../helpers/response");
const moment = require("moment");
listener.on(TRANSACTION_COMPLETED, async ({transaction, charge : { affiliateCharge, superAffiliateCharge}}) => {
    debug("transaction-completed is triggered");
    if (transaction.status.toLowerCase() != "success" && transaction.status.toLowerCase() != "successful")
        return;

    const user = await userRepository.find(transaction.userId);
    if (!user)
        return;

    setImmediate(async () => {
        if(!user.affiliateCode)
            return;

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


        //check if the user has a referralCode
        if(!user.referralCode)
            return;


        //check if the REFERRAL_AMOUNT has been deducted already...
        if(user.referralPaid)
            return;


        //check ig the referrer exists
        let referrer = await userRepository.findOne({username: user.referralCode});
        if(!referrer)
            return;

        //check if the required transaction amount is up to the MINIMUM_TRANSACTION_FOR_REFERRAL
        const transactions = await transactionRepository.all({
            userId: transaction.userId,
            status: "SUCCESSFUL"
        });

        const transactionSum = _sumArrayOfObject(transactions, "amount");

        const minimumTransactionAmountBeforeReferralIsGiven = await utilityRepository.fetchByKey("MINIMUM_TRANSACTION_FOR_REFERRAL");
        const referralAmount = await utilityRepository.fetchByKey("REFERRAL_AMOUNT");

        if(!minimumTransactionAmountBeforeReferralIsGiven
            || !minimumTransactionAmountBeforeReferralIsGiven.value
            || minimumTransactionAmountBeforeReferralIsGiven.value > transactionSum)
            return;

        //check if there is a minimum transaction
        if(!referralAmount || !referralAmount.value)
            return;


        let [wallet, created] = await walletRepository.findOrCreate({
            userId: referrer.id,
            userType: "user",
        }, {
            userId: referrer.id,
            userType: "user",
            balance: referralAmount.value,
        });
        if (!created) {
            wallet.balance += parseFloat(referralAmount.value);
            await wallet.save();
        }


        user.referralPaid = `${referralAmount.value} - ${moment().utc().toISOString()}`;
        await user.save();
        let log = await walletLogRepository.create({
            userId: user.id,
            userType: "user",
            amount: referralAmount.value,
            description: `Referral bonus on user ${user.email}`
        });
        debug("completed referral", wallet, log);
    });


    setImmediate(async () => {
       if(transaction.mode != "WALLET")
           return;


       const [wallet, created] = await walletRepository.findOrCreate({
           userId: transaction.userId,
           userType: "user"
       },{
           userId: transaction.userId,
           userType: "user",
           balance: transaction.amount
       });
       if(!created){
           wallet.balance += parseFloat(transaction.amount);
           await wallet.save();
       }

       debug(wallet, created);
    });
});



module.exports = {
    listener,
    TRANSACTION_COMPLETED
};