let dbProduct = require('../data/database') //requiero la base de datos de productos

const db = require('../database/models');
const {
    validationResult
} = require('express-validator');

module.exports = { //exporto un objeto literal con todos los metodos
    index: function (req, res) {

        req.session.url = req.url //inicio la session.url para poder devolver a la vista anterior
        if(typeof req.session.user != 'undefined' && req.session.user.rol == "user"){
        db.Products.findAll()
            .then(productos => {
                res.render('index', { //renderizo en el navegador la vista index que contiene el HOME del sitio
                    title: 'Mercado Liebre', //envío el objeto literal con la o las variables necesarias para renderizar de forma correcta el home
                    css: 'index.css',
                    productos: productos,

                })
            })
            .catch(error => res.send(error))
        }else if(typeof req.session.user != 'undefined' && req.session.user.rol == "store"){
            db.Products.findAll({
                where : {
                    store_id : req.session.user.id
                }
            })
            .then(productos => {
                res.render('index', { //renderizo en el navegador la vista index que contiene el HOME del sitio
                    title: 'Mercado Liebre', //envío el objeto literal con la o las variables necesarias para renderizar de forma correcta el home
                    css: 'index.css',
                    productos: productos,

                })
            })
            .catch(error => res.send(error))
        }else{
            db.Products.findAll()
            .then(productos => {
                res.render('index', { //renderizo en el navegador la vista index que contiene el HOME del sitio
                    title: 'Mercado Liebre', //envío el objeto literal con la o las variables necesarias para renderizar de forma correcta el home
                    css: 'index.css',
                    productos: productos,

                })
            })
            .catch(error => res.send(error))
        }
    },
    listCategories: function (req, res) {

        res.render('categoriesList', {
            title: 'Lista de Categorias',
            css: 'index.css',
            js: 'categorieList.js',

        })
    },
    addCategorie: function (req, res) {
        res.render('categoriesAdd', {
            title: 'Añadir Categoria',
            css: 'index.css',
            js: 'categorieAdd.js'
        })
    },
    saveCategorie: function (req, res) {
        let errores = validationResult(req);
        if (errores.isEmpty()) {
            db.Categories.create({
                    nombre: req.body.nombre.trim(),
                    imagen: (req.files[0]) ? req.files[0].filename : "categorie.png",
                })
                .then(result => {
                    console.log("Categoria añadida");
                    res.redirect('/admin/categorieList')
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            res.render('categoriesAdd', {
                title: 'Añadir Categoria',
                css: 'index.css',
                errors: errores.mapped(),
                old: req.body
            })
        }
    },
    editCategorie: (req, res) => {
        db.Categories.findOne({
            where : {
                id : req.params.id
            },
            include : [
                {association : "subcategorias"}
            ]
            
        })
            .then(categoria => {
                res.render('categoriaEdit', {
                    title: 'Editar Categorias',
                    css: 'index.css',
                    categoria: categoria,
                    js: 'categoriaEdit.js'
                })
            })
            .catch(error => res.send(error))
    },
    updateCategorie: (req, res) => {
        db.Categories.update({
            nombre: req.body.nombre.trim(),
            imagen: (req.files[0]) ? req.files[0].filename : req.body.oldLogo,

        }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => res.redirect('/admin/categorieList'))
        .catch(error => res.send(error))
    },
    deleteCategorie : (req,res) => {
        db.Categories.destroy({
            where : {
                id : req.params.id
            }
        })
        .then(() => res.redirect('/admin/categorieList'))
        .catch(error => res.send(error))
    },
    addSub : (req,res) => {
        
        db.SubCategories.create({
            nombre : req.body.nombre,
            id_categoria : req.body.idCategoria
        })
        .then(()=> res.redirect('/admin/categorieEdit/'+req.body.idCategoria))
        .catch((error)=>res.send(error))
    },
    deleteSub : (req,res) => {
        db.SubCategories.destroy({
            where : {
                id : req.params.id
            }
        })
        .then(()=> res.redirect('/admin/categorieEdit/'+req.body.idCategoria))
        .catch((error)=>res.send(error))
    }


}