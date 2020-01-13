"use strict";
const roles = require('../users/UserConstant');
const { createSuccessResponse, createErrorResponse, validationHandler, formatPhone } = require('../../helpers/response');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { fetchByEmail, generateUid, find, create, updateUser } = require('../users/UserRepository');
const affiliateRepository = require("../affiliates/AffiliateRepository");
const verificationRepository = require("../verifications/VerificationRepository");
const emailService = require("../../services/EmailService");
const smsService = require("../../services/SMSService");
const debug = require("debug")("app:debug");
const messages = require("../../helpers/Messages");
const randomString = require("randomstring");
const walletRepository = require("../wallets/WalletRepository");
const bankAccountRepository = require("../bank-accounts/BankAccountRepository");
const BlockIo = require('block_io');

// generate, save and return this btc address
const generateBtcAddress = async user => {
    let API_KEY = '';
    if (process.env.APP_ENV == "production") {
        API_KEY = process.env.BITCOIN_LIVE_API
    } else {
        API_KEY = process.env.BITCOIN_TEST_API
    }
    const version = 2; // API version
    const block_io = await new BlockIo(API_KEY, process.env.BLOCK_IO_SECRET_PIN, version);

    await block_io.get_new_address({
        'label': `${user.uid}`,
    }, function (error, data) {
        if (error) return console.log("Error occured:", error.message);
        updateUser({
            btcAddress: data.data.address,
            btcAddressId: data.data.user_id
        }, user.id)
        return data.data.address;
    });
}

/**
 * Authenticate User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const login = async (req, res, next) => {
    try {

        debug("Starting Login");
        const valFails = validationResult(req);
        if (!valFails.isEmpty())
            return createErrorResponse(res, validationHandler(valFails), valFails.array);

        let payload = req.body;
        debug("First Query Start");
        let user = await fetchByEmail(payload.email, true);
        debug("First Query end/ Processing start");
        console.log({ user, body: req.body });
        if (!user)
            return createErrorResponse(res, "User Not Found");
        if (!user.isActive)
            return createErrorResponse(res, "Your Account is Inactive. Kindly Contact Your The Admin");
        //Compare Password
        if (!bcrypt.compareSync(payload.password, user.password))
            return createErrorResponse(res, "Invalid Credentials");

        const isMobile = req.body.isMobile || false;

        //generate jwt token
        const access = jwt.sign({ user: user }, process.env.SECURITY_KEY, {
            expiresIn: isMobile ? (86400 * 30) : (86400 * 2) // expires in 48 hours if its not from a mobile device else 30 days
        });

        const refresh = jwt.sign({ userId: user.id }, process.env.SECURITY_KEY, {
            expiresIn: isMobile ? (86400 * 365) : (86400 * 100) // expires in 30days
        });

        //delete password value
        delete user.dataValues.password;

        //check is request is from the mobile app
        if (req.body.isMobile !== undefined && req.body.isMobile) {
            //return an error if user is not a USER
            if (user.roleId !== roles.USER)
                return createErrorResponse(res, "Unauthorized User");
        }

        const [wallets, created] = await walletRepository.findOrCreate({
            userType: "user",
            userId: user.id,
        }, {
            userType: "user",
            userId: user.id,
            balance: 0
        });

        debug(created, wallets);
        user.dataValues.balance = wallets.balance;

        // generate btc address if i dont have any and i'm a user
        if (user.dataValues.btcAddress === null && user.dataValues.roleId === 3) {
            const address = generateBtcAddress(user.dataValues);
            user.dataValues.btcAddress = address;
        }

        const bankAccount = await bankAccountRepository.findOne({
            userType: "user",
            userId: user.id,
        });

        if (bankAccount)
            user.dataValues.bankAccount = bankAccount;

        debug("Processing stops");
        return createSuccessResponse(res, {
            user: user,
            token: {
                access,
                refresh
            }
        }, "Login Successful")
    } catch (e) {
        debug(e);
        next(e);
    }
};

/**
 * Validate User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const register = async (req, res, next) => {
    try {
        const valFails = validationResult(req);
        if (!valFails.isEmpty())
            return createErrorResponse(res, validationHandler(valFails), valFails.array);

        let payload = req.body;
        const hashedPassword = bcrypt.hashSync(payload.password, bcrypt.genSaltSync(10));
        let uid = await generateUid();
        let user = await create({
            name: payload.name,
            username: `$${payload.name.substr(0, 3)}${randomString.generate({
                charset: "numeric",
                length: 5
            })}`,
            uid: uid,
            roleId: roles.USER,
            email: payload.email,
            affiliateCode: payload.affiliateCode,
            referralCode: payload.referralCode,
            phone: formatPhone(payload.phone),
            password: hashedPassword
        });

        // generate btc address if i dont have any and i'm a user
        if (user.dataValues.roleId === 3) {
            const address = generateBtcAddress(user.dataValues);
            user.dataValues.btcAddress = address;
        }

        const isMobile = req.body.isMobile || false;
        const access = jwt.sign({ user }, process.env.SECURITY_KEY, {
            expiresIn: isMobile ? (86400 * 30) : (86400 * 2) // expires in 48 hours if its not from a mobile device else 30 days
        });
        const refresh = jwt.sign({ userId: user.id }, process.env.SECURITY_KEY, {
            expiresIn: (86400 * 30) // expires in 30days
        });
        delete user.dataValues.password;
        createSuccessResponse(res,
            {
                user: user,
                token: {
                    access: access,
                    refresh: refresh
                }
            }, "Registration Successful");

        const emailVerification = {
            code: verificationRepository.generateCode(),
            type: "email",
            userType: "user",
            value: user.email
        };

        const phoneVerification = {
            code: verificationRepository.generateCode(),
            type: "phoneNumber",
            userType: "user",
            value: user.phone || user.phoneNumber
        };

        await verificationRepository.bulkCreate([
            emailVerification,
            phoneVerification
        ], { returning: true });

        emailService.send(
            emailVerification.value,
            messages.userEmailVerification(emailVerification.code),
            user.name,
            "Confirm Your Email")
            .then(res => debug("Email Response", res.data))
            .catch(err => {
                debug("Email Error", err.response.body);
                console.log("rr", err);
            });


        let phoneMessage = messages.phoneNumberVerification(user.name, phoneVerification.code);
        smsService.send(user.phone, phoneMessage)
            .then(res => debug("SMS Response", res.data))
            .catch(err => debug("SMS Error", err));

    } catch (e) {
        debug("Error => ", e);
        // handler(e);
        next(e);
    }
};

const refreshToken = async (req, res, next) => {
    let user = await find(req.userId);

    const access = jwt.sign({ user: user }, process.env.SECURITY_KEY, {
        expiresIn: (86400 * 30) // expires in 48 hours if its not from a mobile device else 30 days
    });

    const refresh = jwt.sign({ userId: user.id }, process.env.SECURITY_KEY, {
        expiresIn: (86400 * 30) // expires in 30days
    });
    delete user.dataValues.password;
    return createSuccessResponse(res, {
        user: user,
        token: {
            access: access,
            refresh: refresh
        }
    }, "Token Refresh Successful");
};

const affiliates = async (req, res, next) => {
    try {
        const valFails = validationResult(req);
        if (!valFails.isEmpty())
            return createErrorResponse(res, validationHandler(valFails), valFails.array);

        let payload = req.body;
        let affiliate = await affiliateRepository.findOneWithPassword({ email: payload.email });
        if (!affiliate)
            return createErrorResponse(res, "Invalid Credentials");
        if (!bcrypt.compareSync(payload.password, affiliate.password))
            return createErrorResponse(res, "Invalid Credentials");

        if (affiliate && affiliate.isActive == 0)
            return createErrorResponse(res, "Account is inactive. Contact the Administrator");

        const access = jwt.sign({ affiliate }, process.env.SECURITY_KEY, {
            expiresIn: 86400 * 2 // expires in 48 hours if its not from a mobile device else 30 days
        });

        const refresh = jwt.sign({ affiliateId: affiliate.id }, process.env.SECURITY_KEY, {
            expiresIn: 86400 * 100 // expires in 30days
        });

        //delete password value
        delete affiliate.dataValues.password;
        return createSuccessResponse(res, {
            affiliate,
            token: {
                access,
                refresh
            }
        }, "Login Successful")
    } catch (e) {
        debug(e);
        next(e);
    }
};

module.exports = {
    login,
    register,
    refreshToken,
    affiliates
};