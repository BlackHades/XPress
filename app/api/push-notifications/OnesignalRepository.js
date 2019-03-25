const OneSignal = require("onesignal-node");
const log = require("../../../helpers/Logger");
require('dotenv').config();

const myClient = new OneSignal.Client({
    // note that "app" must have "appAuthKey" and "appId" keys
    app: { appAuthKey: process.env.ONESIGNAL_API_KEY, appId: process.env.ONESIGNAL_APP_ID }
});

const sendNotificationToUser = (tokens = [], message, data) => {

    if(!tokens || tokens.length === 0)
        return;

    const notification = new OneSignal.Notification({
        contents: {
            en: message,
        },
        include_player_ids: tokens
    });

    notification.postBody['data'] = data;

    myClient.sendNotification(notification)
        .then(res => {
            log(JSON.stringify(res))
        })
        .catch(err => log(JSON.stringify(err)))

};

module.exports = {
    sendNotificationToUser
};