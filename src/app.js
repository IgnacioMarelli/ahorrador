import express from 'express';
import mongoose from 'mongoose';
import config from '../data.js';
import cookieParser from 'cookie-parser';
const app = express();
import fileDirName from './utils/fileDirName.js';
const { __dirname } = fileDirName(import.meta);
import { router } from './Routes/router.js'
import configureHandlebars from './config/hbs.config.js';
import {routerUser} from './Routes/routerUser.js'
import passport from 'passport';
import { configPassport } from './config/passport.config.js';
import errorMiddleware from './utils/middlewares/error.middleware.js';
import { addLogger } from './utils/winston.customlevels.js';
import { routerGuiso } from './Routes/routerGuiso.js';
const {MONGO_URL, DAO} = config;
const PORT = config.PORT || 3000;
if(DAO==='MONGO'){
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});}
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser(config.SECRET));
app.use(express.static(__dirname+'/public'));
app.use(addLogger)
app.set('views', __dirname+'/views');
app.use('/api', router);
app.use('/', routerUser);
app.use('/guiso', routerGuiso);

app.get('/api/loggerTest', (req, res) => {
  const logger = req.logger;

  logger.debug('Mensaje de debug');
  logger.http('Mensaje HTTP');
  logger.info('Mensaje de información');
  logger.warning('Mensaje de advertencia');
  logger.error('Mensaje de error');
  logger.fatal('Mensaje de error fatal');

  res.send('Logs generados');
});
app.use(passport.initialize());
app.use(errorMiddleware)
configPassport()
configureHandlebars(app)

const httpServer = app.listen(PORT, ()=>console.log(`Servidor escuchando en el puerto ${PORT }`));
//configureSocket(httpServer);
