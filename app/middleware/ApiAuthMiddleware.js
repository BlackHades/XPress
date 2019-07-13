const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const roles = require('../users/UserConstant');

const {createErrorResponse} = require('../../helpers/response');

/**
 * Basic User Authentication
 * @param req
 * @param res
 * @param next
 * @returns {void|*}
 */
let authenticate = (req,res,next) => {
    console.log('data', req.headers['authentication']);
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.body.token;
    if (!token) return createErrorResponse(res,"No token provided.");
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.SECURITY_KEY, function(err, decoded) {
        if (err) return createErrorResponse(res,'Failed to authenticate token.');
        // console.log("User: " + JSON.stringify(decoded));
        let user = decoded.user;
        let affiliate = decoded.affiliate;
        req.user = user;
        req.affiliate = affiliate;
       if(req.user){
           if(user.roleId === roles.AGENT)
               req.agent = user;
           if(user.roleId === roles.ADMINISTRATOR)
               req.admin = user;
       }
        next();
    });
};


let agentAuth = (req,res,next) => {
    if(req.user && req.user.roleId <= roles.AGENT)
        next();
    else
        return createErrorResponse(res,"Unauthorized");

};


let adminAuth = (req,res,next) => {
    console.log("User: ", JSON.stringify(req.user));
    console.log("User: ", roles.ADMINISTRATOR);
    if(req.user && req.user.roleId == roles.ADMINISTRATOR)
        next();
    else
        return createErrorResponse(res,"Unauthorized");

};

let refresh = (req,res,next) => {
    console.log('data', req.headers['authentication']);
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.body.token;
    if (!token) return createErrorResponse(res,"No token provided.");
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.SECURITY_KEY, function(err, decoded) {
        if (err) return createErrorResponse(res,'Failed to authenticate token.');
        console.log("User: " + JSON.stringify(decoded));
        req.userId = decoded.userId;
        next();
    });
};


module.exports = {
    authenticate, agentAuth,adminAuth, refresh
};
