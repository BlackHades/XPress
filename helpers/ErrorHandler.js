const {createErrorResponse} = require('./response');

// let handler = (ex, data = null) =>{
//     console.log("An Error Occurred: " + JSON.stringify(ex));
//     if(data === null)
//         console.log("Data: " + JSON.stringify(data));
// };

let handler = (err, req, res, next) => {
    // set locals, only providing error in development

    //send data to slack or any other thing

    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};
    createErrorResponse(res,err.message, err);
};


module.exports = handler;