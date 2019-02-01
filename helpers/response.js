let createSuccessResponse = (res,data, message = "Completed") => {
    res.send({status: 1, message: message, data:data});
};

let createErrorResponse = (res, message = "Oops. An Error Occurred", data) => {
    res.json({status: 0, message: message, data:data});
};


module.exports = {
  createSuccessResponse,
  createErrorResponse
};