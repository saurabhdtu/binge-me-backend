const CustomErr = require('../common/error');
const {errorLogger} = require('./logger');
let errorHandler = (err, req, res, next) => {
    errorLogger.log(err.message, err);
    /*
    error
    warn
    info
    verbose
    debug
    silly
    */
    res.status(CustomErr.errorOccurred).send(new CustomErr(CustomErr.errorOccurred, err.message));
}
module.exports = errorHandler;