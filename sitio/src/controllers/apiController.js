const db = require('../database/models')

module.exports = {
    tiendas: (req, res) => {
        db.Stores.findAll({
                attributes: [
                    "nombre"
                ]
            })
            .then(tiendas => res.status(200).json(tiendas))
            .catch(error => console.log(error))
    },
    emails: (req, res) => {
        db.Users.findAll({
                attributes: [
                    "email"
                ]
            })
            .then(emails => res.status(200).json(emails))
            .catch(error => console.log(error))
    },
    categorias: (req, res) => {
        db.Categories.findAll({
                include: [{
                    association: 'subcategorias'
                }]
            })
            .then(categorias => res.json(categorias))
            .catch(error => console.log(error))

    },
    subcategorias: (req, res) => {
        db.SubCategories.findAll({
                where: {
                    id_categoria: req.params.id
                }
            })
            .then(subcategorias => res.json(subcategorias))
            .catch(error => console.log(error))

    },
    usersAll: (req, res) => {
        db.Users.findAll()
            .then(usuarios => {
                const data = {
                    count: usuarios.length,
                    users: usuarios.map(usuario => {
                        return user = {
                            id: usuario.id,
                            nombre: usuario.nombre,
                            email: usuario.email,
                            detail: req.get('host') + req.originalUrl + '/' + usuario.id
                        }
                    }),
                }
                res.json(data)
            })
            .catch(error => console.log(error))
    },
    userDetail: (req, res) => {
        db.Users.findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(usuario => {
                const user = {
                    id: usuario.id,
                    firstName: usuario.nombre,
                    lastName: usuario.apellido,
                    email: usuario.email,
                    adress: usuario.direccion,
                    city: usuario.ciudad,
                    state: usuario.provincia,
                    url: usuario.rol == 'store' ? req.get('host') + '/images/logos/' + usuario.avatar : req.get('host') + '/images/users/' + usuario.avatar
                }
                res.json(user)
            })
            .catch(error => console.log(error))
    },
    productsAll: (req, res) => {
        let productos = db.Products.findAll({
            include: [{
                association: 'categoria'
            }]
        })
        let categorias = db.Categories.findAll({
            include: [{
                association: 'productos'
            }]
        })
        Promise.all([productos, categorias])
            .then(([productos, categorias]) => {

                let countByCategory = {};
                categorias.forEach(categoria => {
                    countByCategory = {
                        ...countByCategory,
                        [categoria.nombre]: categoria.productos.length
                    }
                })

                const data = {
                    count : productos.length,
                    categories : categorias.length,
                    countByCategory,
                    products : productos.map(producto => {
                        return {
                            id : producto.id,
                            name : producto.nombre,
                            description : producto.descripcion,
                            image : req.get('host') + '/images/products/' + producto.imagenes,
                            category : producto.categoria.nombre,
                            detail : req.get('host') + req.originalUrl + '/' + producto.id
                        }
                    }),
                  

                }
                res.json(data)
            })
            .catch(error => console.log(error))
    },
    productDetail: (req, res) => {
        db.Products.findOne({
            where : {
                id : req.params.id
            },
            include: [
                {association : 'categoria'}, 
                {association : 'subcategoria'}
            ]
        })
        .then(producto => {
            const products = {
                id : producto.id,
                name : producto.nombre,
                price : producto.precio,
                discount : producto.descuento,
                description : producto.descripcion,
                image : req.get('host') + '/images/products/' + producto.imagenes,
                category : producto.categoria.nombre,   
                subcategory : producto.subcategoria ? producto.subcategoria.nombre : "sin especificar"
            }
            res.json(products)
        })
        .catch(error => console.log(error))
    }

}