/************ BASES DE DATOS ************/
const db = require('../database/models')

/*************** MODULOS ****************/

const {
  validationResult,
  body
} = require('express-validator'); //requiero validationResult de expres-validator
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

module.exports = {
  register: function (req, res) {
    req.session.destroy();
    res.render('storeRegister', {
      title: "Registro de Tienda",
      css: "register.css",
      js: 'storeRegister.js'
    })
  },
  processRegister: (req, res) => {
    db.Users.create({
        nombre: req.body.nombre.trim(),
        apellido: req.body.apellido.trim(),
        email: req.body.email.trim(),
        password: bcrypt.hashSync(req.body.pass.trim(), 10),
        avatar: (req.files[0]) ? req.files[0].filename : "store.png",
        rol: "store"
      })
      .then(user => {
        console.log(user)
        db.Stores.create({
            nombre: req.body.nameStore.trim(),
            logo: (req.files[0]) ? req.files[0].filename : "store.png",
            id_usuario: user.id
          })
          .then(result => {
            console.log(result)
            return res.redirect('/users/login')
          })
          .catch(errores => {
            res.send(errores)
          })
      })
      .catch(errores => {
        res.send(errores)
      })

  },
  login: function (req, res) {
    db.Stores.findOne({
        where: {
          id: req.params.id
        },
        include: [{
          association: 'responsable'
        }]
      })
      .then(tienda => {
        let old = {
          email: tienda.responsable.email
          
        }
        res.render('userLogin', {
          title: "Login de Usuario",
          css: "index.css",
          old: old
        })
      })

  },
  list: function (req, res) {
    db.Stores.findAll({
        include: [{
          association: "responsable"
        }]
      })
      .then(tiendas => {
        res.render('stores', {
          title: "Tiendas Registradas",
          css: 'index.css',
          stores: tiendas
        })
      })
      .catch(err => {
        res.send(err)
      })
  },
  productos: function (req, res) {
    db.Stores.findOne({
        where: {
          id_usuario: req.session.user.id
        },
        include : [
          {
            association : "productos"
          }
        ]
      })
      .then(tienda => {
        res.render('products', {
          title: "Productos",
          productos: tienda.productos,
          css: 'index.css'
      })
      })
      .catch(error => {
        res.send(error)
      })
  }
}