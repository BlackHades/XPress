'use strict';
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const {User} = require('../../../database/sequelize');
const userRepository = require('./UserRepository');
const userConstant = require('./UserConstant');


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
        const hashedPassword = bcrypt.hashSync(payload.password,  bcrypt.genSaltSync(10));
        console.log("hashedPassword: " + hashedPassword);
        let uid = await userRepository.generateUid();
        let user = await User.create({
            name: payload.name,
            uid:uid,
            roleId: payload.roleId,
            email:payload.email,
            phone:payload.phone,
            password: hashedPassword
        });
        console.log("User: " + JSON.stringify(user));
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
        let result = await userRepository.updateUser({name: payload.name, email:payload.email,phone:payload.phone},req.user.id);
        console.log("User: " + JSON.stringify(result));
        console.log("User: " + JSON.stringify(user));
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
        await updateUser({avatar: payload.avatar},req.user.id);

        console.log("User: " + JSON.stringify(user));
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
    let transactions = [];
    return createSuccessResponse(res, {
        user:await userRepository.find(req.params.userId),
        transactions:transactions
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

module.exports = {
  create, update, avatar, all, destroy, details
};