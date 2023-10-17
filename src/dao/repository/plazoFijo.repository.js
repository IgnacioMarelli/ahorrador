import { plazoFijoModel } from "../models/plazoFijo.model.js";


class PlazoFijoRepository {
    #model
    constructor(){
        this.#model= plazoFijoModel;
    }
    async create(fecha, cantidad,mp){
        try {
            if(mp==='mercadopago'){return await this.#model.create({date:fecha, pesos:cantidad,porcentaje:95.7});}
            return await this.#model.create({date:fecha, pesos:cantidad});
        } catch (error) {
            console.error(error);
        }
    }
    async getAll(){
        try {
            const depositos = await this.#model.find().lean();
            return depositos  
        } catch (error) {
            console.error(error);
        }
    }
    async updateDeposito(id, usuario, nuevosDatos){
        return this.#model.updateOne({ _id: id },{ ...usuario, ...nuevosDatos });
    }

}
export default PlazoFijoRepository