const express = require('express'); //requiero express
const router = express.Router(); //requiero el método Router

const apiController = require('../controllers/apiController')

router.get('/tiendas',apiController.tiendas);
router.get('/emails',apiController.emails);
router.get('/categorias',apiController.categorias);
router.get('/subcategorias/:id',apiController.subcategorias);

/* sprint 7 */
router.get('/users',apiController.usersAll);
router.get('/users/:id',apiController.userDetail);
router.get('/products', apiController.productsAll);
router.get('/products/:id', apiController.productDetail)


module.exports = router;