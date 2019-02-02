const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const roles = require('../api/users/UserConstant');

const {createErrorResponse} = require('../../helpers/response');

/**
 * Basic User Authentication
 * @param req
 * @param res
 * @param next
 * @returns {void|*}
 */
let authenticate = (req,res,next) => {
    // console.log('data', req.headers['authentication']);
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if (!token) return createErrorResponse(res,"No token provided.");

    jwt.verify(token, config.SECURITY_KEY, function(err, decoded) {
        if (err) return createErrorResponse(res,'Failed to authenticate token.');
        // console.log("User: " + JSON.stringify(decoded));
        let user = decoded.user;
        req.user = user;
        if(user.roleId === roles.AGENT)
            req.agent = user;
        if(user.roleId === roles.ADMINISTRATOR)
            req.admin = user;
        next();
    });
};


let adminAuth = (req,res,next) => {
    if(req.user && req.user === roles.ADMINISTRATOR)
        next();
    else
        return createErrorResponse(res,"Unauthorized");

};

module.exports = {
    authenticate, adminAuth
};
