var express = require('express');
var router = express.Router();

const cookieCheck = require('../middlewares/cookieCheck');
const upLogos = require('../middlewares/upLogos');
const sessionAdminCheck = require('../middlewares/sessionAdminCheck');
const categorieValidator = require('../validations/categorieValidator')

const controller = require('../controllers/mainController'); //requiero el controlador para que se haga cargo de la lógica

/* GET home page. */
router.get('/',cookieCheck, controller.index);

router.get('/admin/categorieList',controller.listCategories)
router.get('/admin/categorieAdd',sessionAdminCheck,controller.addCategorie)
router.post('/admin/categorieAdd',upLogos.any(),categorieValidator, controller.saveCategorie)


module.exports = router;