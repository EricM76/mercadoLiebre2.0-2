const express = require('express'); //requiero express
const router = express.Router(); //requiero el método Router

const apiStoreController = require('../controllers/apiStoreController')

router.get('/tiendas',apiStoreController.tiendas);
router.get('/emails',apiStoreController.emails)

module.exports = router;