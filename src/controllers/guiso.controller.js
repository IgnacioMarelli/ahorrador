import GuisoService from "../Service/guiso.service.js";
import GuisoRepository from "../dao/repository/guiso.repository.js";
import PlazoFijoRepository from "../dao/repository/plazoFijo.repository.js";
class GuisoController {
    #service;
    constructor(service){
        this.#service=service;
    }
    async guisoGet(req,res,next){
        try {
            const pesos= await this.#service.pesos(req)?await this.#service.pesos(req):0
            res.render('guiso', {total:pesos});
        } catch (error) {
            next(error)
        }
    }
    async guisoPost(req,res,next){
        try {
            await this.#service.guisoPost(req, res, next);
            res.status(200).send('OK'); 
        } catch (error) {
            next(error)
        }
    }

}
const guisoController = new GuisoController(new GuisoService(new (GuisoRepository),new (PlazoFijoRepository)));
export default guisoController