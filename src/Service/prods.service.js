import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";
export default class ProdService {
    #dao;
    #plazoFijoService;
    #ingresoRepository;
    constructor(dao, plazoFijoService, ingresoRepository) {
      this.#dao = dao;
      this.#plazoFijoService=plazoFijoService;
      this.#ingresoRepository=ingresoRepository;
    }
    async getDolarBlue(){
        const url = 'https://dolarapi.com/v1/dolares/blue';
        const options = {
            method: 'GET'
        }
        const response = await fetch(url, options);        
        const result = await response.json();
        return result.venta
    }
    async getObjetivo(req){
        try { 
            let user = await this.#dao.findByName(req.user.first_name);
            const {limit, ingreso} = req.query;
            const usuario = user._id.toString();
            const response = await this.#ingresoRepository.paginate({limit: 3, usuario, lean: true});
            response.docs.forEach(e=>{
                const date= e.date.toLocaleString("es-AR", {timeZone: "America/Argentina/Buenos_Aires"});
                e.date=date;
            })
            await this.updateDay(user)
            await this.plazoFijo(user)
            user = await this.#dao.findByName(req.user.first_name);
            const diarioPesificado= await this.objetivoDiario(user.objetivo, user.disponiblePesos, user.tiempo, user.salario, user.disponibleUSD)
            const balance = await this.balanceDiario(user, usuario, diarioPesificado.objetivoDiario);
            const mesPesificado = diarioPesificado.objetivoDiario*30.4;
            const progreso= Math.round(diarioPesificado.ahorroTotal*100/user.objetivo);
            const sueño = {objetivoMensual:mesPesificado, progreso:progreso, objetivoDiario:diarioPesificado.objetivoDiario, tiempo:user.tiempo, ingresos:response, balance:balance.balance, balanceMensual:balance.balanceMensual};
            return sueño
        } catch (error) {
            console.error(error);
        }
    }
    async post(req, res){
        try {
            const result = await this.getDolarBlue();
            const objetivoTotal = req.body.objetivo/result;
            const ahorros = req.body.ahorros;
            const ahorrosUSD = req.body.ahorrosUSD*result;
            const salario = req.body.salario;
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
            const sueño = await this.#dao.updateUser(user.first_name, user, {objetivo:objetivoTotal, tiempo: tiempo, salario: salario, disponiblePesos:ahorros, disponibleUSD:ahorrosUSD});
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
    async balanceDiario(user, usuario){
        try {
            const ingressos= await this.#ingresoRepository.findByID(usuario);
            const hoy = new Date();
            const fin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
            let balance=0;
            let balanceMensual= 0;
            const plazoFijo = await this.plazoFijo(user);
            if(plazoFijo){
                balance+=plazoFijo;
            }
            ingressos.filter(e => {
                if((e.date < fin) && (e.date > user.date)){
                    balance+=e.pesos;
                };
            });
            ingressos.filter(e => {
                if((new Date(e.date).getMonth() == hoy.getMonth()) && (new Date(e.date).getFullYear() == hoy.getFullYear())){                    balanceMensual+=e.pesos; 
                }; 
            });
            return {balance, balanceMensual}
        } catch (error) {
            console.error(error);
            CustomError.createError({
                name:'Error en el balance',
                cause:'Probablemente en la base de datos',
                message:'Revise estar llamando correctamente a la base de datos',
                cause: ErrorEnum.DATABASE_ERROR
            })
        }

    }
    async objetivoDiario(objetivo, disponible, tiempo, salario, ahorrosUSD){
        const result = await this.getDolarBlue();
        const ahorroPesoDolar= disponible/result;
        const ahorroDolar= ahorroPesoDolar+ahorrosUSD;
        const ahorro = objetivo - ahorroDolar;
        const real = ahorro/tiempo;
        const salarioDolar = salario/result;
        const objetivoMensual = salarioDolar-real;
        const objetivoDiario = objetivoMensual/30.4;
        return{objetivoDiario:objetivoDiario*result, ahorroTotal:ahorroDolar}
    }
    async update(req, next){
        try {
            const ingreso= Number(req.body.ingreso);
            if (ingreso===0) {
                CustomError.createError({
                    name: 'Error en formulario',
                    cause:`El campo de gasto o ingreso está vacío`,
                    message:'Rellene todos los campos porfavor',
                    code: ErrorEnum.BODY_ERROR
                })
            }
            const name = req.user.first_name;
            let user = await this.#dao.findByName(name);
            const date = Date.now();
            await this.#ingresoRepository.create(date, ingreso, req.body.razon, user._id);
            let data = {disponiblePesos:user.disponiblePesos+ingreso};
            if (req.body.plazoFijo) {
                await this.addPlazoFijo(req, name);
                user = await this.#dao.findByName(name);
            }
            await this.#dao.updateUser(user.first_name, user, data);
            if (ingreso<0) {
                if(req.body.mpGasto===true){
                    await this.#dao.updatemp(user.first_name, ingreso);
                }
            }
        } catch (error) {
            next(error);
        }
    }   
    async updateDay(user){
        let now = new Date();
        let oneMonth = new Date(now);
        oneMonth.setDate(oneMonth.getDate() - 31);
        await this.#ingresoRepository.deleteIngreso(oneMonth);
        const fechaInicio =user.date;
        const fechaFin =Date.now();
        const diferencia = fechaFin - fechaInicio;
        let horasPasadas = Math.round(diferencia / (1000 * 60 * 60));
        const diasPasados = horasPasadas/24;
        const diferencia2 = fechaFin - user.creationDate;
        let horasPasadas2 = Math.round(diferencia2 / (1000 * 60 * 60));
        const mesesPasados = horasPasadas2/24;
        if (diasPasados && diasPasados>=1) {
            const ahorro = user.objetivo - user.disponiblePesos;
            const real = ahorro/user.tiempo;
            const objetivoMensual = user.salario-real;
            const objetivoDiario = objetivoMensual/30.4;
            const diasRedondos= Math.round(diasPasados);
            const suma=user.objetivoDiario+objetivoDiario*diasRedondos;
            await this.#dao.updateUser(user.first_name, user, {objetivoDiario: suma, date:fechaFin});       
        }
        if(mesesPasados>30.4){
            const tiempo=user.tiempo-1;
            await this.#dao.updateUser(user.first_name, user, {tiempo: tiempo});   
            await this.#dao.updateUser(user.first_name, user, {creationDate: fechaFin}); 
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
                        await this.#plazoFijoService.updateDeposito(e._id,e.deposito,listo)
                    }
                });
        }
        if(user.plazoFijoMP){
            const mes = 95.3/12;
            const dia = mes/30.4;
            const date= Date.now();
            const milisegundos = date - user.plazoFijoMP.date;
            const dias = milisegundos / 86400000;
            if(dias >= 1){
                const porcentaje= user.plazoFijoMP.pesos*dia/100;
                const ingreso=porcentaje*dias;
                const result = user.plazoFijoMP.pesos + ingreso;
                const realData={plazoFijoMP:{pesos:result, date:Date.now()}}
                await this.#dao.updateUser(user.first_name, user, realData);
                await this.#ingresoRepository.create(date, ingreso, 'mercado pago',user._id);
                return porcentaje
            };
    }
    }
    async addPlazoFijo(req,name){
        req.body.ingreso=Number(req.body.ingreso)
        if(req.body.plazoFijo==='mercadopago'){
            const user = await this.#dao.findByName(req.user.first_name);
            const realData={plazoFijoMP:{pesos:user.plazoFijoMP.pesos+req.body.ingreso, date:Date.now()}}
            return await this.#dao.updateUser(user.first_name, user, realData);
        }
        const ahora = Date.now();
        const deposito= await this.#plazoFijoService.create(ahora,req.body.ingreso, req.body.plazoFijo);
        const id = deposito._id.toString();
        return await this.#dao.addMoney(name, id, req.body.plazoFijo);
    }
}
