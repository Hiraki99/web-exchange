var appRoot = require('app-root-path');
var winston = require('winston');

// define the custom settings for each transport (file, console)
var options = {
    
    error: {
        level: 'error',
        filename: `${appRoot}/../logs/nodejs_trex_api/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    warn: {
        level: 'warn',
        filename: `${appRoot}/../logs/nodejs_trex_api/warn.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    info: {
        level: 'info',
        filename: `${appRoot}/../logs/nodejs_trex_api/info.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    verbose: {
        level: 'verbose',
        filename: `${appRoot}/../logs/nodejs_trex_api/verbose.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    debug: {
        level: 'debug',
        filename: `${appRoot}/../logs/nodejs_trex_api/debug.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    silly: {
        level: 'silly',
        filename: `${appRoot}/../logs/nodejs_trex_api/silly.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        filename: `${appRoot}/../logs/nodejs_trex_api/console.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    logErr: {
        level: 'error',
        filename: `${appRoot}/../logs/nodejs_trex_api/log-error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    }
};




// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File(options.error),
        new winston.transports.File(options.warn),
        new winston.transports.File(options.info),
        new winston.transports.File(options.verbose),
        new winston.transports.File(options.debug),
        new winston.transports.File(options.silly),
        new winston.transports.Console(options.console),
        new winston.transports.File(options.logErr)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

exports.log = (req, permissions, allowed) => {
    console.log("safasdfadsfasdf = "+req.use)
    try {
        if (req.user && isAllowed(permissions, allowed)) {
            logger.info(`{"log":"moadmin","hostname":"${req.hostname}","originalUrl":"${req.originalUrl}","username":"${req.user.username}","ip":"${req.ip}","method":"${req.method}"}`);
            next(); // role is allowed, so continue on the next middleware
        }else{
            console.log("user is null")
        }
        // logger.info('log demo')
        // logger.error('log demo errr')
        // logger.debug("adfafdasdfasdf")
    } catch (error) {
        logger.error(`{"error": "${error}"}`)
    }
}

function isAllowed(permissions, allowed) {
    return true
}
exports = logger;


