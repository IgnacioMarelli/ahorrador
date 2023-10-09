import { Router } from 'express';
const routerGuiso = Router();
import guisoController from '../controllers/guiso.controller.js';

routerGuiso.get('/',guisoController.guisoGet.bind(guisoController))
routerGuiso.post('/',guisoController.guisoPost.bind(guisoController))
export  { routerGuiso};
