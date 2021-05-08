const CustomErr = require('../common/error')
let errorHandler = (err, req, res, next) => {
    res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, err.message));
}

module.exports = errorHandler;