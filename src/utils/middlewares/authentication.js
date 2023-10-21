import passport from "passport";
import jwt  from "jsonwebtoken";
import CustomError from "../../errors/custom.error.js";
import ErrorEnum from "../../errors/error.enum.js";
import config from "../../../data.js";
const secret = config.SECRET;

const passportCall = 
(strategy) => {
  return async (req, res, next) => {
    try {
      passport.authenticate(strategy, { users: false }, (error, user, info) => {
        if (error) return next(error);
        if (!user) {
          throw CustomError.createError({
            name: 'Usuario no logueado',
            cause: 'No se logueó correctamente el usuario',
            message: 'Debe iniciar sesión nuevamente',
            code: ErrorEnum.BODY_ERROR
          });
        }
        req.user = user.user;
        next();
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
const created = ()=>{
  return async (req, res, next)=>{
    try {
      const url = req.user.objetivo > 0 ? '/api/inicio' : '/api';
      await res.redirect(url);
    } catch (error) {
      console.error(error); 
    }

  }
}
const guiso = ()=>{
  return async (req,res,next)=>{
    try {
      if(req.body.first_name==='guiso'){res.redirect('/guiso')}
      next();
    } catch (error) {
      console.error(error); 
    }
  }
}
const authorizationPremium = (rol)=>{
  return async (req, res, next)=>{
    try {
      if(req.user.role !== rol&& req.user.role !=='premium') return res.status(403).send({error: ` Usuario sin rol de ${rol}`});
      next();
    } catch (error) {
      next(error)
    }

  }
}

export {created, passportCall, authorizationPremium, guiso}