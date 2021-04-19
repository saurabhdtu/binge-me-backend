const CustomErr = require('../common/error')

function authenticateAdmin(req, res, next){
    if(!req.user.isAdmin){
        return res.status(CustomErr.statusCodeForbidden).send(new CustomErr(CustomErr.statusCodeForbidden),"Access denied");
    }
    next();
}

module.exports = authenticateAdmin;