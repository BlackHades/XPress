const { check } = require('express-validator/check');
/**
 * Update User Validation
 * @returns {ValidationChain[]}
 */
exports.upsert = () => {
    return [
        check('key','Key is required').not().isEmpty(),
        check('value','Value is required').not().isEmpty(),
    ];
};