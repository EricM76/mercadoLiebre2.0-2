const fs = require('fs');
const path = require('path');

const dbProducts = require('../data/database') //requiero la base de datos de productos
const dbCategories = require('../data/db_categories'); //requiero las categorias

const {validationResult} = require('express-validator');

module.exports = { //exporto un objeto literal con todos los metodos
    listar: function(req, res) {
        res.render('products', {
                title: "Todos los Productos",
                css:'index.css',
                productos: dbProducts
            }) //muestra información de los productos
    },
    search: function(req, res) {
  
        let errors = validationResult(req); //devuelve los errores del formSearch
        
        if(errors.isEmpty()){ //si no hay errores, es decir que la consulta no venga vacía
        let buscar = req.query.search;
        let productos = [];
        dbProducts.forEach(producto => {
            if (producto.name.toLowerCase().includes(buscar)) {
                productos.push(producto)
            }
        })
        res.render('products', {
            title: "Resultado de la búsqueda",
            productos: productos,
            css:'index.css'
        })
    }else{
        return res.redirect('/')
    }
    },
    detalle: function(req, res) {

        let id = req.params.id;
        let producto = dbProducts.filter(producto => {
            return producto.id == id
        })
        res.render('productDetail', {
                title: "Detalle del Producto",
                css:'product.css',
                id: id,
                producto: producto[0]
            }) //muestra el detalle de un producto
    },
    agregar: function(req, res) {
        let categoria;
        let sub;
        if (req.query.categoria) {
            categoria = req.query.categoria;
            sub = req.query.sub;
        }
        res.render('productAdd', {
                title: "Agregar Producto",
                css:'product.css',
                categorias: dbCategories,
                categoria: categoria,
                sub: sub
            }) //muestra el formulario para agregar un producto
    },
    publicar: function(req, res, next) {
        let lastID = 1;
        dbProducts.forEach(producto => {
            if (producto.id > lastID) {
                lastID = producto.id
            }
        })
        let newProduct = {
            id: lastID + 1,
            name: req.body.name,
            price: Number(req.body.price),
            discount: Number(req.body.discount),
            category: req.body.category,
            description: req.body.description,
            image: (req.files[0]) ? req.files[0].filename : "default-image.png"
        }
        dbProducts.push(newProduct)
        fs.writeFileSync(path.join(__dirname, "..", "data", "productsDataBase.json"), JSON.stringify(dbProducts), 'utf-8')
        res.redirect('/products')
    },
    show: function(req, res) {
        let idProducto = req.params.id;
     
    // AGREGUÉ LA LOGICA PARA DETERMINAR QUE SOLAPA SE MUESTRA EN FUNCIÓN DEL VALOR DEL PARAMETRO :flap
    //***********************************************************************************
        let flap = req.params.flap;
        let activeDetail;
        let activeEdit;
        let showDetail;
        let showEdit;
        if(flap == "show"){
            activeDetail = "active";
            showDetail = "show";
        }else{
            activeEdit = "active";
            showEdit = "show";
        }
    //***********************************************************************************

        let resultado = dbProducts.filter(producto => {
            return producto.id == idProducto
        })
        res.render('productShow', {
            title: "Ver / Editar Producto",
            css:'product.css',
            total: dbProducts.length,
            producto: resultado[0],
            categorias: dbCategories,
            //envío las variables correspondientes para ser usadas en la vista
            activeEdit:activeEdit,
            activeDetail:activeDetail,
            showEdit:showEdit,
            showDetail:showDetail
      
        })

    },
    editar: function(req, res, next) {
        let idProducto = req.body.id;
        dbProducts.forEach(producto => {
            if (producto.id == idProducto) {
                producto.id = Number(req.body.id);
                producto.name = req.body.name.trim();
                producto.price = Number(req.body.price);
                producto.discount = Number(req.body.discount);
                producto.category = req.body.category.trim();
                producto.description = req.body.description.trim();
                producto.image = (req.files[0]) ? req.files[0].filename : producto.image
            }
        })

        fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), JSON.stringify(dbProducts))
        res.redirect('/products/show/' + idProducto + '/show')
    },
    eliminar: function(req, res) {
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