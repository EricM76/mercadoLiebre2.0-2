let dbProduct = require('../data/database') //requiero la base de datos de productos

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
            visitas: visitas,
            user: req.session.user
        })
    }

}