import winston from 'winston';
import { loggerLevels } from './loggerLevels.js';

export const logger = winston.createLogger({

    levels: loggerLevels.levels,

    transports: [

        new winston.transports.Console(
            { 
                level: 'debug',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize({colors: loggerLevels.colors}),
                    winston.format.simple()
                )
            }
        ),

        new winston.transports.File(
            { 
                level: 'warning',
                filename: './src/error.log',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            }
        ),

    ]

});


export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} on ${req.url} - ${new Date().toLocaleDateString}`)
    next();
};