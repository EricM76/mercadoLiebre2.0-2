let dbUsers = require('../data/dbUsers');

/************ BASES DE DATOS ************/
let db = require('../database/models')

const {check,validationResult,body} = require('express-validator');

module.exports = [
    check('nombre')
    .isLength({
        min:1
    })
    .withMessage("Debes ingresar tu nombre"),

    check('apellido')
    .isLength({
        min:1
    })
    .withMessage("Debes ingresar tu apellido"),

    body('email')
    .custom(function(value){
        /* --------------------------------------------obsoleto
        for(let i = 0; i<dbUsers.length;i++){
            if(dbUsers[i].email == value){
                return false
            }
        }
        return true
        --------------------------------------------------------*/
        return db.Users.findOne({
            where:{
                email:value
            }
            })
            .then(result => {
                if(result){
                    return Promise.reject('Este mail ya está registrado')
                }
            })
    }),
    check('pass')
    .notEmpty()
    .withMessage("Debes ingresar una contraseña"),

    check('pass')
    .isLength({
        min:6,
        max:12
    })
    .withMessage("Debes ingresar una contraseña entre 6 y 12 caracteres"),

    body('pass2')
    .custom((value,{req})=>{
        if(value !== req.body.pass){
            return false
        }
        return true
    })
    .withMessage("Las contraseñas no coinciden"),

    check('bases')
    .isString("on")
    .withMessage("Debe aceptar las bases y condiciones")
]
