import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";
export default class ProdService {
    #dao;
    #depositoService;
    constructor(dao, depositoService) {
      this.#dao = dao;
      this.#depositoService=depositoService;
    }
    async getObjetivo(req){
        try {
            const url = 'https://dolarapi.com/v1/dolares/blue';
            const options = {
                method: 'GET'
            }
            const response = await fetch(url, options);        
            const result = await response.json();
            const objetivo = await this.#dao.findByName(req.user.first_name);
            await this.plazoFijo(objetivo)
            const ahorro = objetivo.objetivo - objetivo.disponible;
            const real = ahorro/objetivo.tiempo;
            const objetivoMensual = objetivo.salario-real;
            const mesPesificado=objetivoMensual* result.venta;
            const objetivoDiario = objetivoMensual/30.4;
            const diarioPesificado= objetivoDiario* result.venta;
            
            const sueño = {objetivoMensual:mesPesificado, objetivoDiario:diarioPesificado, tiempo:objetivo.tiempo}
            await this.#dao.updateUser(objetivo.first_name, objetivo, {objetivoDiario:objetivoDiario})
            return sueño
        } catch (error) {
            console.error(error);
        }
    }
    async post(req, res){
        try {
            const url = 'https://dolarapi.com/v1/dolares/blue';
            const options = {
                method: 'GET'
            }
            const response = await fetch(url, options);        
            const result = await response.json();
            const objetivoTotal = req.body.objetivo/result.venta;
            const ahorros = req.body.ahorros/result.venta;
            const salario = req.body.salario/result.venta;
            const tiempo = req.body.tiempo;
            const user = req.user;
            const keyWithEmptyValue = Object.entries(req.body).find(([key, value]) => value === "");
            if(keyWithEmptyValue){
                CustomError.createError({
                    name: 'Error en formulario',
                    cause:`El campo ${keyWithEmptyValue[0]} está vacío`,
                    message:'Rellene todos los campos porfavor',
                    code: ErrorEnum.BODY_ERROR
                })
            }
            const sueño = await this.#dao.updateUser(user.first_name, user, {objetivo:objetivoTotal, tiempo: tiempo, salario: salario, disponible:ahorros});
            return sueño
        }catch (error) {
            throw CustomError.createError({
                name:'Problema en el dao',
                cause:'Hay un error al crear el producto',
                message:'Debe revisar la utilización de mongoose, o el modelo',
                code: ErrorEnum.DATABASE_ERROR
            })
        }
    }
    async update(req){
        try {
            const url = 'https://dolarapi.com/v1/dolares/blue';
            const options = {
                method: 'GET'
            }
            const response = await fetch(url, options);        
            const result = await response.json();
            const ingreso= req.body.ingreso/result.venta;
            const name = req.user.first_name;
            let user = await this.#dao.findByName(name);
            let data = {disponible:user.disponible+ingreso};
            if (req.body.plazoFijo) {
                await this.addPlazoFijo(req, name);
                user = await this.#dao.findByName(name);
            }
            await this.#dao.updateUser(user.first_name, user, data);
        } catch (error) {
            console.error(error);
        }
    }   
    async plazoFijo(user){
        if(user.plazoFijoBanco.length>0){
            user.plazoFijoBanco.forEach(async e => {
                    const mes = e.deposito.porcentaje/12;
                    const date= Date.now();
                    const milisegundos = date - e.deposito.date;
                    const dias = milisegundos / 86400000;
                    const meses= Math.round(dias/30);
                    if(meses >= 1){
                        const porcentaje= e.deposito.pesos*mes/100;
                        e.deposito.pesos = e.deposito.pesos + porcentaje*meses;
                        const listo = {pesos:e.deposito.pesos, date:Date.now()};
                        await this.#depositoService.updateDeposito(e._id,e.deposito,listo)
                    }
                });
        }
        if(user.plazoFijoMP.length>0){
            user.plazoFijoMP.forEach(async e => {
                const mes = e.deposito.porcentaje/12;
                const dia = mes/30.4;
                const date= Date.now();
                const milisegundos = date - e.deposito.date;
                const dias = milisegundos / 86400000;
                if(dias >= 1){
                    const porcentaje= e.deposito.pesos*dia/100;
                    e.deposito.pesos = e.deposito.pesos + porcentaje*dias;
                    const listo = {deposito:e.deposito.pesos, date:Date.now()};
                    await this.#dao.updateDeposito(e._id,e,listo)
                }
            });
    }
    }
    async addPlazoFijo(req,name){
        const ahora = Date.now();
        const deposito= await this.#depositoService.create(ahora,req.body.ingreso, req.body.plazoFijo);
        const id = deposito._id.toString();
        return await this.#dao.addMoney(name, id, req.body.plazoFijo);
    }
}
