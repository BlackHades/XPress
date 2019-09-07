"use strict";

const { createSuccessResponse, createErrorResponse } = require("../../../helpers/response");
const debug = require("debug")("app:debug");
const newsRepository = require("./newsRepository");
const userRepository = require("../../users/UserRepository");
const userConstant = require('../../users/UserConstant');
const pushTokenRepository = require("../../push-notifications/PushTokenRepository");
const onesignalRepository = require("../../push-notifications/OnesignalRepository");
const log = require("../../../helpers/Logger");

exports.send = async (req, res) => {
    debug("I AM here In app notification messages-----------------------");
    let { title, message } = req.body;
    if (!title)
        return createErrorResponse(res, "Title is required");
    if (!message)
        return createErrorResponse(res, "Message is required");

    const users = await userRepository.all();
    // const users = await userRepository.all({
    //     where: {
    //         roleId: 3
    //     }
    // });
    // const users = await userRepository.fetchByRole(userConstant.USER);
    // const users = await userRepository.fetchByRole(userConstant.USER);

    debug('users - ', users);

    await newsRepository.create(message);

    await users.map(user => {
        pushTokenRepository.fetchUserTokens(user.id, true)
            .then(tokens => {
                log("messages: " + JSON.stringify(message));
                if (tokens.length === 0)
                    return;
                tokens = tokens.map(t => t.token);
                const data = {
                    notificationType: "NEWS",
                    message: message
                };
                log("data: " + JSON.stringify({ data: data, tokens: tokens, message: message }));
                onesignalRepository.sendNotificationToUser(tokens, title, message, data)
            })
            .catch(err => log("pusherror for news: " + err));
    });



    // console.log(quert)

    // await newsRepository.bulkCreate(query);
    // const allSMS = manyTo;
    // let length = 199;
    // while (allSMS.length) {
    //     const data = allSMS.splice(0, length);
    //     debug(data.length, data.join());
    //     smsService.send(data.join(), message)
    //         .then(response => debug("In app notification messages sent", response.data))
    //         .catch(err => debug("ErrorSingle", err.response));
    // }

    return createSuccessResponse(res, null, "In app notification messages sent");
};

exports.fetch = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    return createSuccessResponse(res, await newsRepository.paginate({}, page, limit))
};