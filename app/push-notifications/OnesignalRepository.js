'use strict';
const OneSignal = require("onesignal-node");
const log = require("../../helpers/Logger");
require('dotenv').config();
const debug = require("debug")("app:debug");
const myClient = new OneSignal.Client({
    userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY,
    // note that "app" must have "appAuthKey" and "appId" keys
    app: { appAuthKey: process.env.ONESIGNAL_API_KEY, appId: process.env.ONESIGNAL_APP_ID }
});

const sendNotificationToUser = (tokens = [], title, message, data) => {

    if (!tokens || tokens.length === 0)
        return;


    const notification = new OneSignal.Notification({
        headings: {
            en: title
        },
        contents: {
            en: message,
        }
    });
    notification.postBody['data'] = data;

    if(process.env.APP_ENV != "development")

    myClient.sendNotification(notification)
        .then(res => {

            log(res.httpResponse.statusCode);
        })
        .catch(err => log(JSON.stringify(err)));

    let length = 2000;
    if (tokens.length > length) {
        while (tokens.length) {
            const data = tokens.splice(0, length);
            debug(data.length);
            notification.include_player_ids = data;
            myClient.sendNotification(notification)
                .then(res => {
                    log(res.httpResponse.statusCode);
                })
                .catch(err => log(JSON.stringify(err)))
        }

    } else {
        notification.include_player_ids = tokens;
        myClient.sendNotification(notification)
            .then(res => {
                log(res)

                log(res.httpResponse.statusCode);
            })
            .catch(err => log(JSON.stringify(err)))
    }
};

module.exports = {
    sendNotificationToUser
};