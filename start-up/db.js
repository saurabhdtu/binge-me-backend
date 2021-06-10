const config = require('config');
const { errorLogger, infoLogger } = require('../middlewares/logger');
const mongoose = require('mongoose');
module.exports = function () {
    infoLogger.info('attempting mongo connection');
    mongoose.connect(config.get('database'), { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 3000, connectTimeoutMS: 3000, socketTimeoutMS: 3000 }).then(() => {
        infoLogger.info('Connected to MongoDB...');
    });
}