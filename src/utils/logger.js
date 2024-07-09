import winston from 'winston';
import { loggerLevels } from './loggerLevels.js';
import { config } from '../config/config.js';


winston.addColors(loggerLevels.colors);


const consoleTransport = new winston.transports.Console({

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        winston.format.simple()
    )
    
});

const fileTransport = new winston.transports.File({

    filename: './src/error.log',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )

});

const transports = [];

if (config.MODE === 'development') {

    transports.push(
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({ all: true }),
                winston.format.simple()
            )
        })
    );
} else {
    transports.push(
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({ all: true }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'info',
            filename: './src/error.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    );

};

export const logger = winston.createLogger({
    levels: loggerLevels.levels,
    transports: transports
});

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} on ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
};