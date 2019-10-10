"use strict";

const { createSuccessResponse, createErrorResponse } = require("../../../helpers/response");
const debug = require("debug")("app:debug");
const newsRepository = require("./NewsRepository");
const userRepository = require("../../users/UserRepository");
const userConstant = require('../../users/UserConstant');
const pushTokenRepository = require("../../push-notifications/PushTokenRepository");
const onesignalRepository = require("../../push-notifications/OnesignalRepository");
const log = require("../../../helpers/Logger");

exports.send = async (req, res, next) => {
    debug("I AM here In app notification messages-----------------------");
    try{
        let { title, message } = req.body;
        if (!title)
            return createErrorResponse(res, "Title is required");
        if (!message)
            return createErrorResponse(res, "Message is required");

        const users = await userRepository.getUserTokenWithPushToken({
            roleId: userConstant.USER
        });
        // debug('users - ', users);

        await newsRepository.create({ title, message });

        let tokens = [];
        await Promise.all(await users.map(user => {
            // log("messages: " + JSON.stringify(user.pushTokens));
            if (user.pushTokens && user.pushTokens.length === 0)
                return;
            user.pushTokens.map(t => tokens.push(t.token));
        }));
        tokens = tokens.filter(Boolean);
        const data = {
            notificationType: "NEWS",
            message: message
        };
        log("data: " + JSON.stringify({ data: data, tokens: tokens, message: message }));
        onesignalRepository.sendNotificationToUser(tokens, title, message, data);
        return createSuccessResponse(res, tokens, "In app notification messages sent");
    }catch (e) {
        debug("Exception", e);
        console.log("Error", {e});
        return next(e);
    }
};

exports.fetch = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    return createSuccessResponse(res, await newsRepository.get(page, limit))
};