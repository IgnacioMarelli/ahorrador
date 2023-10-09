import { generateToken } from '../utils/middlewares/jwt.middleware.js';
import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";
import config from "../../data.js";
const SECRET = config.SECRET;
export default class userService {
  #dao;
  constructor(dao) {
    this.#dao = dao;
  }
    async iniciar(res, req, next){
        try {
            const user = await this.#dao.findByName(req.body.first_name);
            if(!user){
               await this.postRegister(req);
            }else{
                const fechaInicio =user.creationDate;
                const fechaFin =Date.now();
                const diferencia = fechaFin - fechaInicio;
                let horasPasadas = Math.round(diferencia / (1000 * 60 * 60));
                const diasPasados = horasPasadas/24;
                if (diasPasados && diasPasados>1) {
                    const diasRedondos= Math.round(diasPasados);
                    const suma=req.user.objetivoDiario+req.user.objetivoDiario*diasRedondos;
                    await this.#dao.updateUser(req.user.first_name, req.user, {objetivoDiario: suma, last_connection:horasPasadas});       
                }
             }
            const newUser = await this.#dao.findByName(req.body.first_name)
            const token = generateToken(newUser);
            res.cookie('AUTH',token,{
                maxAge:60*60*1000*24,
                httpOnly:true
            });
        } catch (error) {
            next(error)
        }

    }
    async postRegister (req){
        const usuario = req.body;
        try {
            const ahora = Date.now();
            const user = await this.#dao.create(usuario, ahora);
            return user
        } catch (error) {
            console.error(error);
        }    
    }


    async deleteUser (req){
        const idUser = req.params.idUser;
        await this.#dao.deleteUser({ _id: idUser });
    }

    async postDocs(req){
        const img = req.files;
        if(img.length===0){
            throw CustomError.createError({
                name:'Error al cargar archivo',
                cause:'No se subió ningún archivo',
                message:'Debe seleccionar un archivo para subir',
                code: ErrorEnum.BODY_ERROR
            })
        }
        const filenames = [];
        const filePath= img[0].path;
        let filename= img[0].filename;
        for(const key in img){
            if(img.hasOwnProperty(key)){
                const files = img[key];
                
                if(Array.isArray(files)){
                    files.forEach(file =>{
                        filenames.push(file.filename)
                    })
                }else{
                    filenames.push(files.filename)
                }
                
            }
        }
        return await this.#dao.addDoc(req.params.uid, filename, filePath);
    }
    async deleteUsers(req, res, next){
        let now = new Date();
        let twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        await this.#dao.deleteUsers(twoDaysAgo);
    }
}