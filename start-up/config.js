const config = require('config');
module.exports = function () {
    if (!config.get('jwtSecretKey')) {
        throw (Error('JWT secret key not setup in environment variables'))
    }
};