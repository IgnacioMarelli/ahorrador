import { userModel } from "../models/users.model.js";
class UserRepository {
    #model
    constructor(){
        this.#model= userModel;
    }
    async getAll(){
        return await this.#model.find().lean();
    }
    async findByName(name){
        return await this.#model.findOne({ first_name: name }).lean();
    }
    async create(user, date){
        try {
            return await this.#model.create({...user, date: date});
        } catch (error) {
            console.error(error);
        }

    }
    async updateUser(name, usuario, nuevosDatos){
        return await this.#model.updateOne({ first_name: name },{ ...usuario, ...nuevosDatos });
    }
    async addDoc(id, filename, filePath ){
        return await this.#model.findOneAndUpdate({_id: id}, {$push: {documents: {name:filename, reference:filePath}}})
    }
    async plazoFijo(name, plazoFijo, dep,date){
        if (plazoFijo==='mercadopago') {
            return await this.#model.findOneAndUpdate({first_name: name}, {$push:{plazoFijoMP:{deposito: dep, date:date}}});
        }
        await this.#model.findOneAndUpdate({first_name: name}, {$push:{plazoFijoBanco:{deposito: dep, date:date}}});
    }
    async updateDeposito(id, usuario, nuevosDatos){
        return this.#model.updateOne({ _id: id },{ ...usuario, ...nuevosDatos });
    }
    async addMoney(name, dep, mp){
        if(mp==='mercadopago'){
            await this.#model.findOneAndUpdate({first_name: name}, {$push:{plazoFijoMP:{deposito: dep}}})
        }else{
            await this.#model.findOneAndUpdate({first_name: name}, {$push:{plazoFijoBanco:{deposito: dep}}});
        }
        return
    }

}
export default UserRepository