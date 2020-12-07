var express = require('express');
var router = express.Router();

const upLogos = require('../middlewares/upLogos');
const sessionAdminCheck = require('../middlewares/sessionAdminCheck');
const categorieValidator = require('../validations/categorieValidator')

const controller = require('../controllers/mainController'); //requiero el controlador para que se haga cargo de la lógica

/* GET home page. */
router.get('/', controller.index);

router.get('/admin/categorieList', sessionAdminCheck,controller.listCategories);
router.get('/admin/categorieAdd',sessionAdminCheck,controller.addCategorie);
router.post('/admin/categorieAdd',upLogos.any(),categorieValidator, controller.saveCategorie);
router.get('/admin/categorieEdit/:id',sessionAdminCheck,controller.editCategorie);
router.put('/admin/categorieEdit/:id',upLogos.any(),sessionAdminCheck,controller.updateCategorie);
router.post('/admin/categorieDelete/:id',controller.deleteCategorie);

router.post('/admin/subAdd',controller.addSub)
router.post('/admin/subDelete/:id',controller.deleteSub)

module.exports = router;