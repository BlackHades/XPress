"use strict";

exports.affiliateEmailVerification = (code) => {
    return `Hello and welcome to chiji14xchange!<br/> We’re excited to get you started in the affiliates program. Use the code below to confirm your email and activate your account.<br/><br/><br/> <b style="font-family: 'Nunito', sans-serif; font-size: 50px; align-content: center">${code}</b>`
};

exports.affiliateEmailApproval = () => {
    return "Hooray!!! Your affiliate application has been approved and you now have full access to your account.";
};

exports.affiliateEmailRejection = () => {
    return "Unfortunately, Your affiliate application has been rejected. We wish you all the best in your future endeavors.";
};


exports.phoneNumberVerification = (name, code) => {
    return `Hi ${name}, Use the code ${code} to confirm your phone number. Disregard this message if you did not inititate it.`
};