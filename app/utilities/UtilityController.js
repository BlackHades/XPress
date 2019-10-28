'use strict';
const { createSuccessResponse, createErrorResponse, validationHandler } = require('../../helpers/response');
const { fetchByKey, fetchAll, upsert } = require("./UtilityRepository");
const log = require("../../helpers/Logger");
const userRepository = require('../users/UserRepository');


/**
 * This method create or update a key with a value
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
exports.upsert = async (req, res, next) => {
    return createSuccessResponse(res, await upsert(req.body.key, JSON.stringify(req.body.value)))
};


exports.fetch = async (req, res, next) => {
    try {
        let key = req.params.key || null;
        if (!key)
            return createSuccessResponse(res, await fetchAll());
        else
            return createSuccessResponse(res, await fetchByKey(key));
    } catch (e) {
        log(e);
        return createSuccessResponse(res, await fetchAll());
    }
};

// console.log(Buffer.from('Hello World!').toString('base64'));
// console.log(Buffer.from(b64Encoded, 'base64').toString());

exports.unsubscribe = async (req, res, next) => {
    const email = Buffer.from(req.params.key, 'base64').toString();
    const user = await userRepository.fetchByEmail(email);

    if (!user) {
        return createErrorResponse(res, 'Invalid User Please try again!', 400)
    }


    userRepository.updateUser({ subscribe: 0 }, user.id)
        .then(async response => {
            log("response: " + response);
            return createSuccessResponse(res, await userRepository.find(req.body.userId), `User subscription removed!`)
        }).catch(err => next(err));


    // next(err)
};
