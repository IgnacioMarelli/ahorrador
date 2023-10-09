import UserRepository from "../dao/repository/user.repository.js";
import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";
import userService from "../Service/user.serivce.js";

class UsersController {
    #service 
    constructor(service){
        this.#service=service;
    }
    async iniciar(req, res, next){
        try {
            await this.#service.iniciar(res, req, next);
            res.status(200).send('OK'); 
        } catch (error) {
            next(error)
        }

    }
    async inicio(req,res, next){
        try {
            res.render('inicio');
        } catch (error) {
            next(error)
        }
    }

    async postLogin (req, res, next){
        try {
            const user = await this.#service.postLogin(req,res);
            res.status(200).send(user); 
        } catch (error) {
            next(error)
        }
    }
    async logout (req, res, next){
        try {
            await this.#service.updateUser(req)
            res.clearCookie('AUTH')
            res.redirect('/api/users/login');
        } catch (error) {
            next(error)
        }
    }
    async updateUser (req, res, next){
        try {
            const user = await this.#service.updateUser(req)
            res.status(200).send(user);
        } catch (error) {
            next(error)
        }
    }
    async deleteUser (req, res, next){
        try{
            await this.#service.deleteUser(req)
            res.status(200).send('Eliminado');
        }catch(error){
            next(error)
        }
    }
    async postRestorePass (req, res, next){
        try {
           await this.#service.postRestorePass(req, res);
           res.status(200).send('Mail enviado con éxito'); 
        } catch (error) {
            next(error)
        }
    }
    async getRestorePass(req, res, next){
        try {
            res.render('restorePassword'); 
        } catch (error) {
            next(error)
        }
    }
    async newPass(req, res, next){
        try {
            const newPass= await this.#service.newPass(req);
            res.send(newPass);
        } catch (error) {
            next(error)
        }
    }
    async getPremium(req, res, next){
        try {
            const user= await this.#service.getUser(req);
            const cart = req.user.cart[0]?.products?.length === 0 ? null : req.user.cart[0]?._id ?? null;
            res.render('premium',{
                role:user.role,
                userId: user.id.toString(),
                user:user,
                cart: cart
            })
        } catch (error) {
            next(error)
        }

    }
    async newRole(req, res, next){
        try {
            await this.#service.newRole(req, res, next);
            res.status(200).send('Role modificado')
        } catch (error) {
            next(error)
        }

    }
    async postDocs(req, res, next){
        try {
            const doc = await this.#service.postDocs(req)
            res.status(200).send(doc)
        } catch (error) {
            next(error)
        }
    }

    async deleteUsers(req, res, next){
        try {
            await this.#service.deleteUsers();
            res.status(204).send('Usuario eliminado')
        } catch (error) {
            next(error)
        }
    }
    async getAdmin(req, res,next){
        try {
            const user= req.user;
            const users = await this.#service.getAllUsers();
            const cart = req.user.cart[0]?.products?.length === 0 ? null : req.user.cart[0]?._id ?? null;
            res.render('admin',{
                userId: user.id.toString(),
                response: users,
                user:user,
                cart:cart
            })
        } catch (error) {
            throw CustomError.createError({
                name:'Error al renderizar',
                cause:'El error ocurrió al renderizar admin en handlebars',
                message:'Verifique que este bien la view de handlebars',
                code: ErrorEnum.ROUTING_ERROR
            })
        }
    }

}
const userController = new UsersController(new userService(new (UserRepository)));
export default userController