const fs = require('fs');
const path = require('path');

/* const dbProducts = require('../data/database') 
const dbCategories = require('../data/db_categories');  */

const {
    validationResult
} = require('express-validator');
const db = require('../database/models');

const {
    Op,
    where
} = require('sequelize');
const {
    send
} = require('process');

module.exports = { //exporto un objeto literal con todos los metodos
    listar: function (req, res) {
        db.Stores.findOne({
                where: {
                    id_usuario: req.session.user.id
                }
            })
            .then(tienda => {
                console.log(tienda)
                db.Products.findAll({
                        where: {
                            id_tienda: tienda.dataValues.id
                        }
                    })
                    .then(result => {
                        res.send(result)
                    })
                    .catch(error => {
                        res.send(error)
                    })
            })
            .catch(error => {
                res.send(error)
            })

    },
    search: function (req, res) {
        if (req.query.search == "") {
            res.redirect('/')
        }

        let buscar = req.query.search;

        db.Products.findAll({
                where: {
                    nombre: {
                        [Op.like]: `%${buscar}%`
                    }
                }
            })
            .then(result => {
                res.render('products', {
                    title: "Resultado de la búsqueda",
                    productos: result,
                    css: 'index.css'
                })
            })
            .catch(err => {
                res.send(err)
            })

    },
    detalle: function (req, res) {
        db.Products.findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(producto => {
                res.render('productDetail', {
                    title: "Detalle del Producto",
                    css: 'product.css',
                    producto: producto,
                })
            })
            .catch(error => console.log(error))

    },
    agregar: function (req, res) {

        db.Categories.findAll({
                order: [
                    'nombre'
                ]
            })
            .then(categorias => {
                res.render('productAdd', {
                    title: "Agregar Producto",
                    css: 'product.css',
                    js: 'productAdd.js',
                    categorias: categorias
                })
            })
    },
    publicar: function (req, res, next) {
        let errores = validationResult(req);
        if (errores.isEmpty()) {

            db.Users.findOne({
                    where: {
                        id: req.session.user.id
                    },
                    include: [{
                        association: "tienda"
                    }]
                })
                .then(user => {
                    db.Products.create({
                            nombre: req.body.nombre.trim(),
                            precio: parseFloat(req.body.precio).toFixed(2),
                            descuento: Number(req.body.descuento),
                            descripcion: req.body.descripcion,
                            imagenes: req.files[0].filename,
                            store_id: user.tienda.id,
                            id_categoria: Number(req.body.categoria)
                        })
                        .then(result => {
                            console.log(result)
                            res.redirect('/stores/products')
                        })
                        .catch(err => {
                            res.send(err)
                        })
                })
                .catch(err => {
                    res.send(err)
                })
        } else {
            db.Categories.findAll({
                    order: [
                        'nombre'
                    ]
                })
                .then(categorias => {
                    let oldCategoria;
                    if (req.body.categoria) {
                        categorias.forEach(categoria => {
                            if (categoria.id == req.body.categoria) {
                                oldCategoria = categoria.nombre
                            }
                        });
                    }
                    res.render('productAdd', {
                        title: "Agregar Producto",
                        css: 'product.css',
                        categorias: categorias,
                        js: 'productAdd.js',
                        errors: errores.mapped(),
                        old: req.body,
                        oldCategoria: oldCategoria
                    })
                })
        }


    },
    show: function (req, res) {

        // AGREGUÉ LA LOGICA PARA DETERMINAR QUE SOLAPA SE MUESTRA EN FUNCIÓN DEL VALOR DEL PARAMETRO :flap
        //***********************************************************************************
        let flap = req.params.flap;
        let activeDetail;
        let activeEdit;
        let showDetail;
        let showEdit;
        if (flap == "show") {
            activeDetail = "active";
            showDetail = "show";
        } else {
            activeEdit = "active";
            showEdit = "show";
        }
        //***********************************************************************************
        let producto = db.Products.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                    association: "categoria"
                },
                {
                    association: "subcategoria"
                }
            ]
        })
        let categorias = db.Categories.findAll()


        Promise.all([producto, categorias])
            .then(([producto, categorias]) => {
                res.render('productShow', {
                    title: "Ver / Editar Producto",
                    css: 'product.css',
                    js: 'productEdit.js',
                    producto: producto,
                    categorias: categorias,
                    //envío las variables correspondientes para ser usadas en la vista
                    activeEdit: activeEdit,
                    activeDetail: activeDetail,
                    showEdit: showEdit,
                    showDetail: showDetail

                })
            })
            .catch(error => res.send(error))
    },
    editar: function (req, res) {
        let errores = validationResult(req);
        if (errores.isEmpty()) {

            db.Users.findOne({
                where: {
                    id: req.session.user.id
                },
                include: [{
                    association: "tienda"
                }]
            })
            .then(user => {
            db.Products.update({
                    nombre: req.body.nombre.trim(),
                    precio: parseFloat(req.body.precio).toFixed(2),
                    descuento: Number(req.body.descuento),
                    descripcion: req.body.descripcion,
                    imagenes: req.files[0] ? req.files[0].filename : req.body.imagenOriginal,
                    store_id: user.tienda.id,
                    id_categoria: Number(req.body.categoria),
                    id_subcategoria: Number(req.body.subcategoria)
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => res.redirect('/products/show/' + req.params.id + '/show'))
            })
            .catch(error => res.send(error))
        } else {

            let producto = db.Products.findOne({
                where: {
                    id: req.params.id
                },
                include: [{
                    association: "categoria"
                },
                {
                    association: "subcategoria"
                }
            ]
            })
            let categorias = db.Categories.findAll()


            Promise.all([producto, categorias])
                .then(([producto, categorias]) => {
                    res.render('productShow', {
                        title: "Ver / Editar Producto",
                        css: 'product.css',
                        js: 'productEdit.js',
                        producto: producto,
                        categorias: categorias,
                        //envío las variables correspondientes para ser usadas en la vista
                        activeEdit: "active",
                        activeDetail: "",
                        showEdit: "show",
                        showDetail: "",
                        old: req.body
                    })
                })
                .catch(error => res.send(error))
        }
    },
    eliminar: function (req, res) {
        let idProducto = req.params.id;
        dbProducts.forEach(producto => {
            if (producto.id == idProducto) {
                aEliminar = dbProducts.indexOf(producto)
                dbProducts.splice(aEliminar, 1)
            }
        })
        fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), JSON.stringify(dbProducts))
        res.redirect('/users/profile')
    }
}