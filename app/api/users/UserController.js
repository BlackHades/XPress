const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');


/**
 * Create User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
let create = async (req, res, next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;
        const hashedPassword = bcrypt.hashSync(payload.password,  bcrypt.genSaltSync(10));
        console.log("hashedPassword: " + hashedPassword);
        let user = await User.create({
            name: payload.name,
            roleId: payload.roleId,
            email:payload.email,
            phone:payload.phone,
            password: hashedPassword
        });
        console.log("User: " + user);
        createSuccessResponse(res, user)
    }catch (e) {
        // handler(e);
        next(e);
    }
    return createSuccessResponse(res, {admin:req.admin, body: req.body});
};


let me = (req,res,next) => {

};


module.exports = {
  create
};