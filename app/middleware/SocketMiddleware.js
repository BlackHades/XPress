const jwt = require('jsonwebtoken');

const authenticate = (token) => {
    if (!token) return null;

    console.log(token);
    jwt.verify(token, process.env.SECURITY_KEY, (err, decoded) => {
        if (err) return null;
        console.log("User: " + JSON.stringify(decoded.user));
        return Promise.resolve(decoded.user);
    });
};


module.exports = {
  authenticate
};
