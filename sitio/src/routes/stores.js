/*****************MODULOS*********************/
const express = require('express'); //requiero express
const router = express.Router(); //requiero el método Router

/*****************CONTROLADORES*********************/
const controller = require('../controllers/storeController')


/*****************MIDDLEWARES*********************/
const upLogos = require('../middlewares/upLogos'); //requiero el modulo que se encarga de guardar el avatar, vía multer


/*****************VALIDACIONES*********************/
const registerValidator = require('../validations/registerValidator'); //valido los datos ingresados en el formulario de registro
const loginValidator = require('../validations/loginValidator'); //valido los datos ingresados en el formulario de logueo


router.get('/register',controller.register)
router.post('/register',upLogos.any(), registerValidator,controller.processRegister);
router.get('/login/:id',controller.login)
router.get('/list',controller.list)

module.exports = router;