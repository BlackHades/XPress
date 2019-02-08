const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const {User} = require('../../../database/sequelize');
const {fetchByEmail, updateUser} = require('../users/UserRepository');


let change = async (req, res, next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;
        let user = req.user;

        //Compare oldPassword to Users Password
        if(!bcrypt.compareSync(payload.oldPassword,user.password))
            return createErrorResponse(res,"Password Mismatch");

        //Hash New Password
        const hashedPassword = bcrypt.hashSync(payload.newPassword,  bcrypt.genSaltSync(10));

        user.password = hashedPassword;

        //Update Database
        await updateUser({password: hashedPassword}, user.id);

        //return response
        return createSuccessResponse(res, user, "Password Changed Successfully");
    }catch (e) {
        next(e);
    }
};


let reset = async (req, res, next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;

        //Fetch User by email
        let user = fetchByEmail(payload.email);

        //Hash New Password
        const hashedPassword = bcrypt.hashSync(payload.newPassword,  bcrypt.genSaltSync(10));

        user.password = hashedPassword;
        //Update Database
        await updateUser({password: hashedPassword}, user.id);

        //return response
        return createSuccessResponse(res, user, "Password Reset Successful");
    }catch (e) {
        next(e);
    }
};


module.exports = {
    change,
    reset
};