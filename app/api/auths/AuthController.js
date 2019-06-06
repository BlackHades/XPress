const {User} = require('../../../database/sequelize');
const roles = require('../users/UserConstant');
const {createSuccessResponse, createErrorResponse, validationHandler} = require('../../../helpers/response');
const {validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {fetchByEmail, generateUid, find} = require('../users/UserRepository');
const config = require('../../../config/config');
const log = require("../../../helpers/Logger");

/**
 * Authenticate User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const login = async (req, res, next) => {
  try{

    //validate
    const valFails = validationResult(req);
    if(!valFails.isEmpty())
      return createErrorResponse(res,validationHandler(valFails), valFails.array);

    let payload = req.body;

    // return createSuccessResponse(res, req.body);
    //Fetch User By Email
    let user = await fetchByEmail(payload.email, true);

    if(!user.isActive)
      return createErrorResponse(res,"Your Account is Inactive. Kindly Contact Your The Admin");
    //Compare Password
    if(!bcrypt.compareSync(payload.password,user.password))
      return createErrorResponse(res,"Invalid Credentials",);


    const isMobile = req.body.isMobile || false;

    //generate jwt token
    const access = jwt.sign({ user: user }, process.env.SECURITY_KEY, {
      expiresIn: isMobile ? (86400 * 30) : (86400 * 2) // expires in 48 hours if its not from a mobile device else 30 days
    });

    const refresh = jwt.sign({ userId: user.id  }, process.env.SECURITY_KEY, {
      expiresIn: isMobile ? (86400 * 365) : (86400 * 100) // expires in 30days
    });

    //delete password value
    delete user.dataValues.password;


    log("user: " + JSON.stringify(user));

    //check is request is from the mobile app
    if(req.body.isMobile !== undefined && req.body.isMobile){
      //return an error if user is not a USER
      if(user.roleId !== roles.USER)
          return createErrorResponse(res, "Unauthorized User");
    }
    return createSuccessResponse(res,{
      user:user,
      token:{
        access,
        refresh
      }},"Login Successful" )
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
    // console.log("hashedPassword: " + hashedPassword);
    let uid = await generateUid();

    let user = await User.create({
      name: payload.name,
      uid:uid,
      roleId: roles.USER,
      email:payload.email,
      phone:payload.phone,
      password: hashedPassword
    });

    const isMobile = req.body.isMobile || false;

    console.log("User: " + user);


    const access = jwt.sign({ user: user }, process.env.SECURITY_KEY, {
      expiresIn: isMobile ? (86400 * 30) : (86400 * 2) // expires in 48 hours if its not from a mobile device else 30 days
    });

    const refresh = jwt.sign({ userId: user.id }, process.env.SECURITY_KEY, {
      expiresIn: (86400 * 30) // expires in 30days
    });
    delete user.dataValues.password;
    return createSuccessResponse(res,{
        user:user,
        token:{
            access:access,
            refresh:refresh
        }},"Registration Successful" );
  }catch (e) {
    // handler(e);
    next(e);
  }
};



const refreshToken = async (req,res,next) => {
    log("User: " + JSON.stringify(req.user));
    let user = await find(req.userId);
    log("User: " + JSON.stringify(user));



    const access = jwt.sign({ user: user }, process.env.SECURITY_KEY, {
      expiresIn: (86400 * 30) // expires in 48 hours if its not from a mobile device else 30 days
    });

    const refresh = jwt.sign({ userId: user.id  }, process.env.SECURITY_KEY, {
      expiresIn: (86400 * 30) // expires in 30days
    });
    delete user.dataValues.password;
    return createSuccessResponse(res,{
      user:user,
      token:{
        access:access,
        refresh:refresh
      }}, "Token Refresh Successful" );
};

module.exports = {
  login,
  register,
  refreshToken
};