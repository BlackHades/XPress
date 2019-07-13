"use strict";
const debug = require("debug")("app:debug");
/**
 * Log Handler
 * @param message
 */
module.exports = (message) => {
    // console.log("Push Notification: " + JSON.stringify(message));
    debug("logger",message);
    if(process.env.APP_ENV === "local" || process.env.APP_ENV === "development"){
        console.log(message)
    }
};