/*****************MODULOS*********************/
const express = require('express');
const router = express.Router();


/*****************CONTROLADORES*********************/
const controller = require('../controllers/userController')


/*****************MIDDLEWARES*********************/
const upAvatares = require('../middlewares/upAvatares'); //requiero el modulo que se encarga de guardar el avatar, vía multer
const sessionUserCheck = require('../middlewares/sessionUserCheck'); //chequeo si el usuario levantó sesión


/*****************VALIDACIONES*********************/
const registerValidator = require('../validations/registerValidator'); //valido los datos ingresados en el formulario de registro
const loginValidator = require('../validations/loginValidator'); //valido los datos ingresados en el formulario de logueo

//const imageValidator = require('../validations/imageValidator')


/*****************RUTAS*********************/
router.get('/register',controller.register); //formulario de registro
router.post('/register',upAvatares.any(), registerValidator, controller.processRegister); //derivo al método que guardará al usuario

router.get('/login', controller.login); //formulario de logueo
router.post('/login',loginValidator,controller.processLogin) //derivo al método que procesará el login

router.get('/profile',sessionUserCheck, controller.profile); //vista de perfil de usuario
router.put('/updateProfile/:id',upAvatares.any(),controller.updateProfile) //actualizar datos
router.delete('/delete/:id',controller.delete) //borrar el usuario

router.get('/logout',sessionUserCheck,controller.logout);

module.exports = router;
