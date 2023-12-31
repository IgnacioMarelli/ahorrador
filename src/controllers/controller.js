import ProdService from '../Service/prods.service.js';
import UserRepository from '../dao/repository/user.repository.js';
import PlazoFijoRepository from "../dao/repository/plazoFijo.repository.js";
import IngresoRepository from "../dao/repository/ingreso.repository.js"
class Controller {
    #service;
    constructor(service){
        this.#service=service;
    }
    async inicio(req, res, next){
        const objetivo = await this.#service.getObjetivo(req);
        res.render('gastoNuevo',{objetivo:objetivo})
    }
    async home(req,res,next){
        try {
            res.render('home');
        } catch (error) {
            next(error)
        }
    }
    async post(req,res,next){
        try {
            const gastos = await this.#service.post(req, res)
            res.status(200).send(gastos)
        }catch (error) {
            next(error)
        }
    
    }
    async deleteProd(req,res,next){
        try {
            const eliminado = await this.#service.deleteProd(req);
            res.status(200).send(eliminado);
        } catch (error) {
            next(error);
        }
    } 
    async update(req, res, next){
        try {
            await this.#service.update(req, next);
            await this.inicio(req, res, next);
        } catch (error) {
            next(error)
        }
    }   
}
const controller = new Controller(new ProdService(new (UserRepository), new (PlazoFijoRepository), new(IngresoRepository)));
export default controller