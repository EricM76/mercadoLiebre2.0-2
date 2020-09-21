/************ BASES DE DATOS ************/

let dbProductos = require('../data/database'); //JSON parseado de productos
let dbUsers = require('../data/dbUsers'); //JSON parseado de usuarios

const db = require('../database/models')

/*************** MODULOS ****************/

const {validationResult, body} = require('express-validator'); //requiero validationResult de expres-validator
const bcrypt =require('bcrypt');
const fs = require('fs');
const path = require('path');

module.exports = {
    register:function(req,res){
        res.render('userRegister',{
            title:"Registro de usuario",
            css:"register.css"
        })
    },
    processRegister:function(req,res){
    
        /*************** SEQUELIZE ****************/
        /*******************************************/

        let errors = validationResult(req); //cargo los errores, si los hubiera
        /* -------------------------> obsoleto
        let lastID = 1;
        dbUsers.forEach(user=>{
            if(user.id > lastID){
                lastID = user.id
            }
        })
        -------------------------------------*/
     
        if(errors.isEmpty()){
        
            /* ----------------------------------------------------> obsoleto
            let nuevoUsuario = { 
                id:lastID+1,
                nombre:req.body.nombre,
                apellido:req.body.apellido,
                email:req.body.email,
                avatar:(req.files)?req.files[0].filename:null,
                pass:bcrypt.hashSync(req.body.pass,10),
                rol:"user"
            }
            dbUsers.push(nuevoUsuario);
            dbUsers.sort(function(a,b){ //ordeno los usuarios por id
                return ((a.id<b.id)?-1:(a.id>b.id)?1:0)
            })

            fs.writeFileSync(path.join(__dirname,'..','data','dbUsers.json'),JSON.stringify(dbUsers),'utf-8')
            return res.redirect('/users/login')
            ----------------------------------------------------------------*/

            db.Users.create({
                nombre:req.body.nombre.trim(),
                apellido:req.body.apellido.trim(),
                email:req.body.email.trim(),
                password:bcrypt.hashSync(req.body.pass.trim(),10),
                avatar:(req.files[0])?req.files[0].filename:null,
                rol:"user"
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
             res.render('userRegister',{
                title: "Registro de usuario",
                css:"index.css",
                errors: errors.mapped(),
                old:req.body
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
         
         /*    dbUsers.forEach(user => {
                if(user.email == req.body.email){
                    req.session.user = {
                        id: user.id,
                        nick: user.nombre + " " + user.apellido,
                        email: user.email,
                        avatar: user.avatar
                    }
                }
                if(req.body.recordar){ //si viene tildada el checkbox creo la cookie
                    res.cookie('userMercadoLiebre',req.session.user, {maxAge:1000*60*5})
                }
                res.locals.user = req.session.user
                res.redirect(url)
            }); */

            db.Users.findOne({ //busco el usuario usando el mail ingresado 
                where:{
                    email:req.body.email
                }
            })
            .then(user => {
                req.session.user = { //asigno a la session un objeto literal con los datos del usuario
                    id: user.id,
                    nick: user.nombre + " " + user.apellido,
                    email: user.email,
                    avatar: user.avatar,
                    rol: user.rol
                }
                if(req.body.recordar){ //si viene tildada el checkbox creo la cookie
                    res.cookie('userMercadoLiebre',req.session.user, {maxAge:1000*60*5})
                }
                res.locals.user = req.session.user //asigno session a la variable locals
                return res.redirect(url)
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
                    usuario:user,
                    productos: dbProductos.filter(producto => {
                        return producto.category != "visited" & producto.category != "in-sale"
                    })
                })
            })
        }else{
            res.redirect('/')
        }
      
       /*  res.render('userProfile', {
            title: "Perfil de usuario",
            css:"profile.css",
            productos: dbProductos.filter(producto => {
                return producto.category != "visited" & producto.category != "in-sale"
            })
        }) */
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
                ciudad:req.body.ciudad.trim(),
                provincia:req.body.provincia.trim()
            },
            {
                where:{
                    id:req.params.id
                }
            }
        )
        .catch(err => {
            console.log(err)
        })
       
        return res.redirect('/users/profile')

    },
    logout:function(req,res){
        req.session.destroy(); //elimino la sesion
        if(req.cookies.userMercadoLiebre){ //chequeo que la cookie exista
            res.cookie('userMercadoLiebre','',{maxAge:-1}); //borro la cookie
        }
        return res.redirect('/')
    },
    delete:function(req,res){
        console.log("borrando usuario...")
        if(fs.existsSync(path.join(__dirname,'../../public/images/users/'+req.session.user.avatar))){
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