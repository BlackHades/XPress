"use strict";
const roles = require('../users/UserConstant');
const {createSuccessResponse, createErrorResponse, validationHandler, formatPhone} = require('../../helpers/response');
const {validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {fetchByEmail, generateUid, find, create} = require('../users/UserRepository');
const affiliateRepository = require("../affiliates/AffiliateRepository");
const verificationRepository = require("../verifications/VerificationRepository");
const emailService = require("../../services/EmailService");
const smsService = require("../../services/SMSService");
const debug = require("debug")("app:debug");
const messages =  require("../../helpers/Messages");
const randomString = require("randomstring");
/**
 * Authenticate User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const login = async (req, res, next) => {
    try {

        const valFails = validationResult(req);
        if (!valFails.isEmpty())
            return createErrorResponse(res, validationHandler(valFails), valFails.array);

        let payload = req.body;
        let user = await fetchByEmail(payload.email, true);
        if (!user.isActive)
            return createErrorResponse(res, "Your Account is Inactive. Kindly Contact Your The Admin");
        //Compare Password
        if (!bcrypt.compareSync(payload.password, user.password))
            return createErrorResponse(res, "Invalid Credentials",);

        const isMobile = req.body.isMobile || false;

        //generate jwt token
        const access = jwt.sign({user: user}, process.env.SECURITY_KEY, {
            expiresIn: isMobile ? (86400 * 30) : (86400 * 2) // expires in 48 hours if its not from a mobile device else 30 days
        });

        const refresh = jwt.sign({userId: user.id}, process.env.SECURITY_KEY, {
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
        return createSuccessResponse(res, {
            user: user,
            token: {
                access,
                refresh
            }
        }, "Login Successful")
    } catch (e) {
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
            username: `$${payload.name.substr(0,3)}${randomString.generate({
                charset: "numeric",
                length: 3
            })}`,
            uid: uid,
            roleId: roles.USER,
            email: payload.email,
            affiliateCode: payload.affiliateCode,
            referralCode: payload.referralCode,
            phone: formatPhone(payload.phone),
            password: hashedPassword
        });

        const isMobile = req.body.isMobile || false;
        const access = jwt.sign({user: user}, process.env.SECURITY_KEY, {
            expiresIn: isMobile ? (86400 * 30) : (86400 * 2) // expires in 48 hours if its not from a mobile device else 30 days
        });
        const refresh = jwt.sign({userId: user.id}, process.env.SECURITY_KEY, {
            expiresIn: (86400 * 30) // expires in 30days
        });
        delete user.dataValues.password;
        createSuccessResponse(res, {
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
        ],{returning: true});

        emailService.send(
            emailVerification.value,
            messages.userEmailVerification(emailVerification.code),
            user.name,
            "Confirm Your Email")
            .then(res => debug("Email Response", res.data))
            .catch(err => {
                debug("Email Error", err.response.body);
                console.log("rr",err);
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

    const access = jwt.sign({user: user}, process.env.SECURITY_KEY, {
        expiresIn: (86400 * 30) // expires in 48 hours if its not from a mobile device else 30 days
    });

    const refresh = jwt.sign({userId: user.id}, process.env.SECURITY_KEY, {
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
        let affiliate = await affiliateRepository.findOneWithPassword({email: payload.email});
        if(!affiliate)
            return createErrorResponse(res, "Invalid Credentials");
        if (!bcrypt.compareSync(payload.password, affiliate.password))
            return createErrorResponse(res, "Invalid Credentials",);

        if(affiliate && affiliate.isActive == 0)
            return createErrorResponse(res, "Account is inactive. Contact the Administrator");

        const access = jwt.sign({affiliate}, process.env.SECURITY_KEY, {
            expiresIn: 86400 * 2 // expires in 48 hours if its not from a mobile device else 30 days
        });

        const refresh = jwt.sign({affiliateId: affiliate.id}, process.env.SECURITY_KEY, {
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