import { ingresoModel } from "../models/ingreso.model.js";


class IngresoRepository {
    #model
    constructor(){
        this.#model= ingresoModel;
    }
    async create(date, ingreso,razon, id){
        if(ingreso<0){ return await this.#model.create({date: date, pesos: ingreso, razon: razon, usuario:id, ingreso: false});}
        return await this.#model.create({date: date, pesos: ingreso, razon: razon, usuario:id});
    }
    async paginate({limit, usuario, filter}){
        let query = {...filter, usuario};
        return await this.#model.paginate(query, {limit: limit, sort: { _id: -1}, lean: true})
    }
    async findByID(id){
        return await this.#model.find({ usuario: id }).lean();
    }

}
export default IngresoRepository