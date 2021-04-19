const apiDebugger = require('debug')('app:api');
const jwt = require('jsonwebtoken');
const CustomErr = require('../common/error')
let authenticator = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(CustomErr.statusCodeNotUnauthorized).send(new CustomErr(CustomErr.statusCodeNotUnauthorized, "Unauthorized access"));
    if (token) {
        try {
            const decoded = jwt.verify(token, 'jwtSecretKey');
            req.user = decoded;
            next();
        } catch (ex) {
            return res.status(CustomErr.statusCodeNotUnauthorized).send(new CustomErr(CustomErr.statusCodeNotUnauthorized, "Invalid auth token"));
        }
    }
}

module.exports = authenticator