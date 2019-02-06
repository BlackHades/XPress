const {User} = require('../../../database/sequelize');
const {createSuccessResponse, createErrorResponse} = require('../../../helpers/response');
const handler = require('../../../helpers/ErrorHandler');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {fetchByEmail} = require('../users/UserRepository');
const config = require('../../../config/config');

const login = async (req, res, next) => {
  try{
    const valFails = validationResult(req);
    if(!valFails.isEmpty())
      return createErrorResponse(res,validationHandler(valFails), valFails.array);

    let payload = req.body;
    let user = await fetchByEmail(payload.email);

    //Compare Password
    if(!bcrypt.compareSync(payload.password,user.password))
      return createErrorResponse(res,"Invalid Credentials",);

    // create a token
    const token = jwt.sign({ user: user }, config.SECURITY_KEY, {
      expiresIn: 86400 // expires in 24 hours
    });
    return createSuccessResponse(res,{user:user,token:token},"Login Successful" )
    // console.log("User: " + user);
    // createSuccessResponse(res, user)
  }catch (e) {
     next(e);
  }
};

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


/**
 * Request Validator
 * @param method
 * @returns {*}
 */
const validate = (method) => {
  switch (method) {
    case 'login':{
      return [
          check('email','email is required').exists(),
          check('password','password is required').exists(),
          check('email','email has been taken').custom(value => {
            return User.findOne({email: value}).then(user => {
              console.log("Validation-Email: " + user);
              if(!user){
                return Promise.reject('Invalid Email');
              }
            })
          })
      ];
    }
    case 'register':{
      return [
        check('name','Name is required').exists(),
        check('password','Password is required').exists(),
        check('email','email is required').exists(),
        check('email','email has been taken').custom(value => {
          return User.findOne({email: value}).then(user => {
            console.log("Validation-Email: " + user);
            if(user){
              return Promise.reject('E-mail has been taken');
            }
          })
        })
      ];
    }
  }
};

const validationHandler = result => {
  return result.array().map(i => `${i.msg}`).join('. ')
};


module.exports = {
  validate,
  login,
  register
};