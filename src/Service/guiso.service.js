
export default class GuisoService {
    #dao;
    #plazoFijoService;
    constructor(dao, plazoFijoService) {
      this.#dao = dao;
      this.#plazoFijoService=plazoFijoService;
    }
    async guisoPost (req){
        try {
            const ahora= Date.now();
            const deposito= await this.#plazoFijoService.create(ahora,req.body.deposito);
            const user = await this.#dao.findByName('guiso');
            if(!user){await this.#dao.create();}
            const id = deposito._id.toString();
            const chanchito = await this.#dao.addMoney(id, deposito.pesos);
            return chanchito
        }catch (error) {
            console.error(error);
        }    
    }
    async pesos(req){
        const pesos= await this.#dao.findByName('guiso');
        if (pesos.total>0) {
            await this.actualizar(pesos)
        }
        return pesos.total
    }
    async actualizar(guiso){
        guiso.depositos.forEach(async e => {
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
        return 
    }
}
