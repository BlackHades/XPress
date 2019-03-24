const { check } = require('express-validator/check');
/**
 * Create Push Token Validation
 * @returns {ValidationChain[]}
 */
let register = () => {
    return [
        check('token', 'OneSignal User Id is required').exists(),
    ];
};

module.exports = {
    register
};