require('express-async-errors');// handles the try catches and replaces the use of asyncExecutor
const express = require('express');
const { infoLogger } = require('./middlewares/logger')
const config = require('config');
const morgan = require('morgan');


const app = express();
infoLogger.info('env:'+app.get('env'));

require('./routes')(app);
require('./start-up/db')();
require('./start-up/config')();

if (app.get('env') === "development") {
    app.use(morgan('dev'));
    infoLogger.info('morgan enabled');
} else if (app.get('env') === 'production') {
    require('./start-up/prod')(app);
}

const port = process.env.PORT || 3000;
infoLogger.info('port:'+port)
infoLogger.info(`${config.get('name')}`);
const server = app.listen(port, () => {
    infoLogger.info(`${config.get('name')} server started  on ${port}....`);
})
module.exports = server;