import { Router } from 'express';
const routerUser = Router();
import { passportCall, created, guiso} from '../utils/middlewares/authentication.js';
import { uploader } from '../utils/middlewares/multer.js';
import userController from '../controllers/user.controller.js';

routerUser.get('/',userController.inicio.bind(userController))
routerUser.post('/', created(), guiso(), userController.iniciar.bind(userController))
routerUser.delete('/', passportCall('jwt'), userController.deleteUsers.bind(userController))
routerUser.post('/auth/logout',passportCall('jwt'), userController.logout.bind(userController));
routerUser.put('/:idUser', passportCall('jwt'), userController.updateUser.bind(userController));
routerUser.delete('/:idUser', passportCall('jwt'), userController.deleteUser.bind(userController));
routerUser.post('/:uid/documents', uploader.array("file", undefined), passportCall('jwt') , userController.postDocs.bind(userController))

export  { routerUser};
