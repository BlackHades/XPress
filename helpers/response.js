let createSuccessResponse = (res,data, message = "Completed") => {
    res.json({status: 1, message: message, data:data});
};

let createErrorResponse = (res, message = "Oops. An Error Occurred", data) => {
    res.json({status: 0, message: message, data:data});
};

const validationHandler = result => {
    return result.array().map(i => `${i.msg}`).join('.\n')
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
    validationHandler
};