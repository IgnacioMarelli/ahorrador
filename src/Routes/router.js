import express from 'express';
import { Router } from 'express';
import { passportCall, created } from '../utils/middlewares/authentication.js';
import controller from '../controllers/controller.js';
const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get('/', passportCall('jwt'), created(), controller.home.bind(controller))
router.post('/', passportCall('jwt'),  controller.post.bind(controller))
router.get('/inicio', passportCall('jwt'), controller.inicio.bind(controller))
router.post('/inicio', passportCall('jwt'), controller.post.bind(controller))
router.delete('/:pid',controller.deleteProd.bind(controller))
router.put('/inicio', passportCall('jwt'), controller.update.bind(controller))


export {router};