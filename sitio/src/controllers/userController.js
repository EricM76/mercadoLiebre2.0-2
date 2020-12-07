/************ BASES DE DATOS ************/

let dbProductos = require('../data/database'); //JSON parseado de productos
let dbUsers = require('../data/dbUsers'); //JSON parseado de usuarios

const db = require('../database/models')

/*************** MODULOS ****************/

const {validationResult, body} = require('express-validator'); //requiero validationResult de expres-validator
const bcrypt =require('bcrypt');
const fs = require('fs');
const path = require('path');
const e = require('express');

module.exports = {
    register:function(req,res){
        console.log(req.session.store)
        res.render('userRegister',{
            title:(req.session.store)?"Registro de responsable de la Tienda":"Registro de usuario",
            css:"register.css",
            js : 'userRegister.js'
        })
    },
    processRegister:function(req,res){

        let errors = validationResult(req); //cargo los errores, si los hubiera
       
        if(errors.isEmpty()){       

            db.Users.create({
                nombre:req.body.nombre.trim(),
                apellido:req.body.apellido.trim(),
                email:req.body.email.trim(),
                password:bcrypt.hashSync(req.body.pass.trim(),10),
                avatar:(req.files[0])?req.files[0].filename:"default.png",
                rol:(req.session.store)?req.session.store:"user"
            })
            .then(result => {
                console.log(result)
                return res.redirect('/users/login')
            })
            .catch(errores => {
                errors = {};
                errores.errors.forEach(error => {
                    if(error.path == "nombre"){
                        errors["nombre"] = {};
                        errors["nombre"]["msg"] = error.message
                    };
                    if(error.path == "apellido"){
                        errors["apellido"] = {};
                        errors["apellido"]["msg"] = error.message
                    };
                    if(error.path == "email"){
                        errors["email"] = {};
                        errors["email"]["msg"] = error.message
                    };
                    if(error.path == "password"){
                        errors["password"] = {};
                        errors["password"]["msg"] = error.message
                    }
                })
                res.render('userRegister',{
                    title: "Registro de usuario",
                    css:"index.css",
                    errors: errors,
                    old:req.body
                })
            })
        }
        else{
            (req.fileSave)?fs.unlinkSync(path.join(__dirname,'../../public/images/users/'+req.fileSave)):"";
             res.render('userRegister',{
                title: "Registro de usuario",
                css:"index.css",
                errors: errors.mapped(),
                old:req.body,
                js : 'userRegister.js'
            })
        }
    },
    login:function(req,res){
        res.render('userLogin',{
            title:"Ingresá a tu cuenta",
            css:"index.css"
        })
    },
    processLogin: function(req,res){
        let url = '/'; //asigno a url la ruta del home
        if(req.session.url){
            url = req.session.url //si se deriva por medio de sessionUserCheck, guardo la url de origen para luego, una vez logueado lo redirija a esa pagina
        }
        let errors = validationResult(req);
        if(errors.isEmpty()){

            db.Users.findOne({ //busco el usuario usando el mail ingresado
                where:{
                    email:req.body.email
                },
                include:[{association:"tienda"}] //incluyo la asocciacion para que me traiga tambien la tienda de la cual el usuario es responsable
            })
            .then(user => {
                req.session.user = { //asigno a la session un objeto literal con los datos del usuario
                    id: user.id,
                    nick: user.nombre + " " + user.apellido,
                    email: user.email,
                    avatar: (user.rol == "store")?user.tienda.logo:user.avatar, //si el usuario tiene rol tienda, la imagen de perfil será el logo de la tienda
                    rol: user.rol
                }
                if(req.body.recordar){ //si viene tildada el checkbox creo la cookie
                    res.cookie('userMercadoLiebre',req.session.user, {maxAge:1000*60*5})
                }
                res.locals.user = req.session.user //asigno session a la variable locals
                return res.redirect(url)
            })
            .catch(error => {
                res.send(error)
            })

        }else{
            res.render('userLogin',{
                title:"Ingresá a tu cuenta",
                css:"index.css",
                errors:errors.mapped(),
                old:req.body
            })
        }

    },
    profile: function(req, res) {
        if(req.session.user){
            db.Users.findByPk(req.session.user.id)
            .then(user => {
                console.log(user)
                res.render('userProfile', {
                    title: "Perfil de usuario",
                    css:"profile.css",
                    js : 'userProfile.js',
                    usuario:user,
                })
            })
        }else{
            res.redirect('/')
        }
    },
    updateProfile:function(req,res){
        if(req.files[0]){
            if(fs.existsSync(path.join(__dirname,'../../public/images/users/'+req.session.user.avatar))){
                fs.unlinkSync(path.join(__dirname,'../../public/images/users/'+req.session.user.avatar))
                res.locals.user.avatar = req.files[0].filename
            }

        }
        db.Users.update(
            {
                fecha: req.body.fecha,
                avatar:(req.files[0])?req.files[0].filename:req.session.user.avatar,
                direccion: req.body.direccion.trim(),
                ciudad:req.body.ciudad,
                provincia:req.body.provincia
            },
            {
                where:{
                    id:req.params.id
                }
            }
        )
        .then( () => {
          console.log(req.session.user)

          return res.redirect('/users/profile')
          })
        .catch(err => {
            console.log(err)
        })

    },
    logout:function(req,res){
        req.session.destroy(); //elimino la sesion
        if(req.cookies.userMercadoLiebre){ //chequeo que la cookie exista
            res.cookie('userMercadoLiebre','',{maxAge:-1}); //borro la cookie
        }
        return res.redirect('/')
    },
    delete:function(req,res){
        if(req.session.user.rol == "store"){
            db.Stores.findOne({
                where:{
                    id_usuario:Number(req.session.user.id)
                }
            })
            .then(result => {
                db.Stores.destroy({
                    where:{
                        id:result.dataValues.id
                    }
                })
                .then(result => {
                    console.log("tienda borrada")
                    if(fs.existsSync(path.join(__dirname,'../../public/images/users/'+req.session.user.avatar)) && req.session.user.avatar != "default.png" && req.session.user.avatar != "store.jpg"){
                        fs.unlinkSync(path.join(__dirname,'../../public/images/users/'+req.session.user.avatar))
                    }
                    req.session.destroy(); //elimino la sesion
                    if(req.cookies.userMercadoLiebre){ //chequeo que la cookie exista
                        res.cookie('userMercadoLiebre','',{maxAge:-1}); //borro la cookie
                    }
                    db.Users.destroy({
                        where:{
                            id:req.params.id
                        }
                    })
                    return res.redirect('/')
                })
            })
            .catch(error => {
                console.log(error)
            })
        }else{
            console.log("borrando usuario...")
            if(fs.existsSync(path.join(__dirname,'../../public/images/users/'+req.session.user.avatar)) && req.session.user.avatar != "default.png" && req.session.user.avatar != "store.jpg"){
                fs.unlinkSync(path.join(__dirname,'../../public/images/users/'+req.session.user.avatar))
            }
            req.session.destroy(); //elimino la sesion
            if(req.cookies.userMercadoLiebre){ //chequeo que la cookie exista
                res.cookie('userMercadoLiebre','',{maxAge:-1}); //borro la cookie
            }
            db.Users.destroy({
                where:{
                    id:req.params.id
                }
            })
            return res.redirect('/')
        }
    }
}
