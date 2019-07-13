"use strict";
let createSuccessResponse = (res,data, message = "Completed") => {
    res.json({status: 1, message: message, data:data});
};

let createErrorResponse = (res, message = "Oops. An Error Occurred", data) => {
    res.json({status: 0, message: message, data:data});
};

const validationHandler = result => {
    return result.array().map(i => `${i.msg}`).join('.\n')
};

let formatPhone = (phoneNumber) => {
    const length = phoneNumber.length;
    if (length < 10)
        return null;

    phoneNumber = phoneNumber.replace("-", "");
    phoneNumber = phoneNumber.replace(" ", "");
    phoneNumber = phoneNumber.replace(",", "");
    // return parseInt(phone.substr((length - 10),length));
    phoneNumber = Number(phoneNumber.substr((length - 10), length));
    return phoneNumber ? `+234${phoneNumber}` : undefined;
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
    validationHandler,
    formatPhone
};