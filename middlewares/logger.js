const winston = require('winston');
const config = require('config');
// require('winston-mongodb');
const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({format: winston.format.combine(
            winston.format.colorize({all:true}),
            winston.format.simple()
          )}),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        // new winston.transports.MongoDB({ db: `mongodb://localhost/${config.get('database')}`, level: 'error' })
    ]
});
// winston.createLogger({
//     exitOnError: true,
//     exceptionHandlers: [
//         new winston.transports.Console({format: winston.format.combine(
//             winston.format.colorize({all:true}),
//             winston.format.simple()
//           )}),
//         new winston.transports.File({ filename: './logs/exceptions.log' })
//     ]
// });
const infoLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({format: winston.format.combine(
            winston.format.colorize({all:true}),
            winston.format.simple()
        )})
    ]
});
process.on('unhandledRejection', (err) => {
    throw err;
});
// process.on('uncaughtException', (err) => {
//     logger.error(err.message, err);
//     process.exit(1);
// });
module.exports.errorLogger = errorLogger;
module.exports.infoLogger = infoLogger;