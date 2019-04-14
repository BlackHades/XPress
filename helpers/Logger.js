"use strict";

/**
 * Log Handler
 * @param message
 */
module.exports = (message) => {
    console.debug(message)
    if(process.env.APP_ENV === "local" || process.env.APP_ENV === "development"){
        console.debug(message)
    }
};