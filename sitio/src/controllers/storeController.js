/************ BASES DE DATOS ************/
const db = require('../database/models')

/*************** MODULOS ****************/

const {validationResult, body} = require('express-validator'); //requiero validationResult de expres-validator
const bcrypt =require('bcrypt');
const fs = require('fs');
const path = require('path');

module.exports = {
    preRegister:function(req,res){
      req.session.store = "store";
      res.redirect('/users/register')
    },
    register:function(req,res){
      res.render('storeRegister',{
        title:"Registro de usuario",
        css:"register.css",
        usuario:req.session.store
      })
    },
    processRegister: (req,res) => {
      console.log(req.session.store)
      db.Stores.create({
        nombre:req.body.nameStore.trim(),
        imagen:(req.files[0])?req.files[0].filename:"store.jpg",
        id_usuario:req.session.store.id
    })
    .then(result => {
        console.log(result)
        req.session.destroy()
        return res.redirect('/users/login')
    })
    .catch(errores => {
      console.log(errores)
    })
  },
  list:function(req,res){
    db.Stores.findAll({
      include:[{association: "responsable"}]

    }
    )
    .then(tiendas => {
      res.send(tiendas)
    })
    .catch(err => {
      console.log(err)
    })
  }
}
