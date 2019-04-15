
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');
const {createOrUpdate, upsert} =  require("./PushTokenRepository");

/**
 * Register user token
 * @param req
 * @param res
 * @param next
 */
let register = async (req,res,next) => {
    try{

        //validate
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let token = await upsert(req.user.id,req.body.token);

        console.log("token: " + JSON.stringify(token));
        //create token

        return createSuccessResponse(res, token,"Token Registered Successful" )
    }catch (e) {
        next(e);
    }
};




module.exports ={
    register
};