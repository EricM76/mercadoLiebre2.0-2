let dbProduct = require('../data/database') //requiero la base de datos de productos

const db = require('../database/models');
const {validationResult} = require('express-validator');

module.exports = { //exporto un objeto literal con todos los metodos
    index: function(req, res) {
  
        req.session.url = req.url //inicio la session.url para poder devolver a la vista anterior
        let ofertas = dbProduct.filter(producto => {
            return producto.category == "in-sale"
        })
        let visitas = dbProduct.filter(producto => {
            return producto.category == "visited"
        })
        res.render('index', { //renderizo en el navegador la vista index que contiene el HOME del sitio
            title: 'Mercado Liebre', //envío el objeto literal con la o las variables necesarias para renderizar de forma correcta el home
            css: 'index.css',
            ofertas: ofertas,
            visitas: visitas
            //user: req.session.user
        })
    },
    listCategories:function(req,res){
        db.Categories.findAll()
        .then(categorias => {
            res.render('categoriesList',{
                title: 'Lista de Categorias',
                css: 'index.css',
                categorias:categorias
            })

        })
        .catch(error => {
            console.log(error)
        })
    },
    addCategorie:function(req,res){
        res.render('categoriesAdd',{
            title: 'Añadir Categoria',
            css: 'index.css',
        })
    },
    saveCategorie:function(req,res){
        let errores = validationResult(req);
        if(errores.isEmpty()){
            db.Categories.create({
                nombre:req.body.nombre.trim(),
                imagen:(req.files[0])?req.files[0].filename:"categorie.png",
            })
            .then(result => {
                console.log("Categoria añadida");
                res.redirect('/admin/categorieList')
            })
            .catch(error => {
                console.log(error)
            })
        }else{
            res.render('categoriesAdd',{
                title:'Añadir Categoria',
                css:'index.css',
                errors: errores.mapped(),
                old:req.body
            })
        }
    }

}