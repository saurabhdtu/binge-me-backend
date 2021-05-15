require('express-async-errors');// handles the try catches and replaces the use of asyncExecutor
const express = require('express');
const { infoLogger } = require('./middlewares/logger')
const config = require('config');
const morgan = require('morgan');

process.on('unhandledRejection', (err) => {
    throw err;
});
if (!config.get('jwtSecretKey')) {
    throw (Error('JWT secret key not setup in environment variables'))
}
const app = express();
require('./routes')(app);
require('./db')();

if (app.get('env') === "dev") {
    app.use(morgan('dev'));
    infoLogger.info('morgan enabled');
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    infoLogger.info(`${config.get('name')} server started  on ${port}....`);
})