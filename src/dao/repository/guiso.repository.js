import { guisoModel } from "../models/guiso.model.js";


class GuisoRepository {
    #model
    constructor(){
        this.#model= guisoModel;
    }
    async create(prod){
        try {
            const newCart= await this.#model.create({first_name:'guiso'});
            return newCart
        } catch (error) {
            next(error)
        }
    }
    async addMoney(dep, quantity){
        await this.#model.findOneAndUpdate({first_name: 'guiso'}, {$inc:{"total": quantity}});
        await this.#model.findOneAndUpdate({first_name: 'guiso'}, {$push:{depositos:{deposito: dep}}});
        return await this.#model.findOne({first_name: 'guiso'}).lean();
    }
    async findByName(name){
        return  this.#model.findOne({ first_name: name }).lean();
    }
}
export default GuisoRepository