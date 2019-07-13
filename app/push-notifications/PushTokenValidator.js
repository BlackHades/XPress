const { check } = require('express-validator/check');
/**
 * Create Push Token Validation
 * @returns {ValidationChain[]}
 */
let register = () => {
    return [
        check('token', 'OneSignal User Id is required').exists(),
        check('token', 'OneSignal User Id is required').not().isEmpty(),
    ];
};

module.exports = {
    register
};