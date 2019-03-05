"use strict";

/**
 * Log Handler
 * @param message
 */
const log = (message) => {
    if(process.env.APP_ENV === "local"){
        console.debug(message)
    }
};


module.exports = {
    log
};