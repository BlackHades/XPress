const {User} = require('../../../database/sequelize');
const roles = require('../users/UserConstant');
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {fetchByEmail} = require('../users/UserRepository');
const config = require('../../../config/config');


/**
 * Authenticate User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const login = async (req, res, next) => {
  try{
    const valFails = validationResult(req);
    if(!valFails.isEmpty())
      return createErrorResponse(res,validationHandler(valFails), valFails.array);

    let payload = req.body;
    //Fetch User By Email
    let user = await fetchByEmail(payload.email);

    //Compare Password
    if(!bcrypt.compareSync(payload.password,user.password))
      return createErrorResponse(res,"Invalid Credentials",);


    const token = jwt.sign({ user: user }, process.env.SECURITY_KEY, {
      expiresIn: (86400 * 2) // expires in 48 hours
    });
    return createSuccessResponse(res,{user:user,token:token},"Login Successful" )
  }catch (e) {
     next(e);
  }
};


/**
 * Validate User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const register = async (req, res, next) => {
  try{
    const valFails = validationResult(req);
    if(!valFails.isEmpty())
      return createErrorResponse(res,validationHandler(valFails), valFails.array);

    let payload = req.body;
    const hashedPassword = bcrypt.hashSync(payload.password,  bcrypt.genSaltSync(10));
    console.log("hashedPassword: " + hashedPassword);
    let user = await User.create({
      name: payload.name,
      roleId: roles.USER,
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
};



module.exports = {
  login,
  register
};