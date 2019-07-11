const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../helpers/response');
const {validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const {User} = require('../../database/sequelize');
const jwt = require('jsonwebtoken');
const {fetchByEmail, updateUser} = require('../users/UserRepository');
const sendGrid = require("@sendgrid/mail");
const debug = require("debug")("app:debug");
let change = async (req, res, next) => {
    try{
        const valFails = validationResult(req);
        if(!valFails.isEmpty())
            return createErrorResponse(res,validationHandler(valFails), valFails.array);

        let payload = req.body;
        let user = req.user;

        //Compare oldPassword to Users Password
        if(!bcrypt.compareSync(payload.oldPassword,user.password))
            return createErrorResponse(res,"Current Password is invalid");

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

        let decoded;
        try{
            decoded = jwt.verify(payload.token, process.env.SECURITY_KEY);
        }catch (e) {
            debug(e);
            console.log(e);
            decoded = null;
        }
        if(!decoded)
            return createErrorResponse(res,"Invalid Token");

        //Fetch User by email
        let user = fetchByEmail(decoded.email);

        if(!user)
            return createErrorResponse(res,"User Not Found");

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

const send = async (req, res,next) => {
    const email = req.query.email;
    if(!email)
        return createErrorResponse(res, "Email Not Found");
    const user = await fetchByEmail(email);
    if(!user)
        return createErrorResponse(res, "Account Not Found");

    createSuccessResponse(res,null,"Email Sent");

    const token = jwt.sign({ email: email }, process.env.SECURITY_KEY, {
        expiresIn: (86400) // expires in 1day
    });

    const url = "http://test.chiji14xchange.com/reset-password?token="+token;
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: 'no-reply@chiji14xchange.com',
        subject: 'Password Reset',
        text: `Dear ${user.name},\nYou requested for a password reset, kindly click on ${url} to reset your password`,
        html: `<!DOCTYPE html>
<html>

<head>
    <title>Forget Password Email</title>
</head>

<body>
    <div>
        <h3>Dear ${user.name},</h3>
        <p>You requested for a password reset, kindly use this <a href="${url}">link</a> to reset your password</p>
        <br>
        <p>Cheers!</p>
    </div>
   
</body>

</html>
`,
    };
    sendGrid.send(msg)
        .then(res => {
            debug("Res",res);
            console.log("Res",res);
        })
        .catch(err => {
            debug("Err", err);
            console.log("Err",err);
        });
};


module.exports = {
    change,
    reset,
    send
};