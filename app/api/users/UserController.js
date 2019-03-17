'use strict';
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const {User} = require('../../../database/sequelize');
const userRepository = require('./UserRepository');
const userConstant = require('./UserConstant');
const transactionRepository = require("../transactions/TransactionRepository");


/**
 * Create User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
let create = async (req, res, next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;

        //hash password
        const hashedPassword = bcrypt.hashSync(payload.password,  bcrypt.genSaltSync(10));


        //generate UID
        let uid = await userRepository.generateUid();

        //Create User
        let user = await User.create({
            name: payload.name,
            uid:uid,
            roleId: payload.roleId,
            email:payload.email,
            phone:payload.phone,
            password: hashedPassword
        });
        return createSuccessResponse(res, user, "User Created");
    }catch (e) {
        // handler(e);
        next(e);
    }
};

/**
 * Update User Details
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */

let update = async (req, res, next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;
        let user = req.user;

        //Update User
        await userRepository.updateUser({name: payload.name, email:payload.email,phone:payload.phone},req.user.id);
        return createSuccessResponse(res, user, "User Profile Updated");
    }catch (e) {
        // handler(e);
        next(e);
    }
};

/**
 * Update Avatar
 * @param req
 * @param res
 * @param next
 * @returns {void|*}
 */

let avatar = async (req,res,next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;
        let user = req.user;
        //Update user Object
        user.avatar = payload.avatar;
        // Update Database
        await userRepository.updateUser({avatar: payload.avatar},req.user.id);

        return createSuccessResponse(res, user, "Avatar Updated Successfully");
    }catch (e) {
        // handler(e);
        next(e);
    }
};


/**
 * Fetch All Users
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const all = async (req, res, next) => {
    return createSuccessResponse(res, await userRepository.all());
};


/**
 * Returns User Details
 * @param req
 * @param res
 * @param next
 */
const details = async (req, res, next) => {
    return createSuccessResponse(res, {
        user: await userRepository.find(req.params.userId),
        transactions: await transactionRepository.getUserTransaction(req.params.userId)
    },"User Details Fetched");
};

/**
 * Delete User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const destroy = async (req,res,next) => {
    let userId = req.params.userId;
    if(req.user.id.toString() === userId)
        return createErrorResponse(res, "An Error Occurred. Can't delete Self");

    return createSuccessResponse(res, await userRepository.destroy(userId),"User deleted successfully");

};

const me = async (req, res, next) => {
    return createSuccessResponse(res, {
        user: await userRepository.find(req.user.id),
        transactions: await transactionRepository.getUserTransaction(req.user.id)
    },"User Details Fetched");
};

module.exports = {
  create, update, avatar, all, destroy, details, me
};