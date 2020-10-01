const dbUsers = require('../data/dbUsers');
const db = require('../database/models')

const {check,validationResult,body} = require('express-validator');
const bcrypt = require('bcrypt');

module.exports = [
    check('email')
    .isEmail()
    .withMessage('Debes ingresar un email válido'),

    check('pass')
    .isLength({
        min:1
    })
    .withMessage('Escribe tu contraseña'),
    
   /* body('email')
    .custom(function(value){
    
    return db.Users.findOne({
         where:{
             email:value
         }
     })
     .then(user => {
         if(!user){
             return Promise.reject('Email no registrado')
         }
     })
    }), */

    body('pass')
    .custom((value,{req})=>{
       /*  let result = true
        dbUsers.forEach(user => {
            if(user.email == req.body.email){
                if(!bcrypt.compareSync(value,user.pass)){
                    result = false
                }
            }
        });
        if (result == false){
            return false
        }else{
            return true
        } */
        return db.Users.findOne({
            where:{
                email:req.body.email
            }
        })
        .then(user => {
            if(!bcrypt.compareSync(value,user.dataValues.password)){ //si no machea la contraseña
                return Promise.reject('estas mal')
            }
        })
        .catch(() => {
            return Promise.reject('Credenciales inválidas')
        })
    })
    //.withMessage('Contraseña incorrecta')
]