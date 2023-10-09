import winston from "winston";
import config from '../../data.js'
const customLevelsOptions ={
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5,
    },
    colors:{
        fatal:'red',
        error:'red',
        warning:'yellow',
        info:'blue',
        http:'white',
        debug:'white'
    }
}
winston.addColors(customLevelsOptions.colors);

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.File({
            filename:'./log/error.log',
            level:'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    timestamp:true,
    transports:[
        new winston.transports.File({
            filename:'./log/error.log',
            level:'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            ),
        })
    ],
});
export const addLogger = (req, res, next) => {
    if(config.ENVIROMENT == 'DEV'){
        req.logger = devLogger;
        req.logger.http(`${req.method} in ${req.url}`);
    }else{
        req.logger = prodLogger;
    }
    
    next();                                           
}