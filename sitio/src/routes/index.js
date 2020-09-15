var express = require('express');
var router = express.Router();

const cookieCheck = require('../middlewares/cookieCheck');

const controller = require('../controllers/mainController'); //requiero el controlador para que se haga cargo de la lógica

/* GET home page. */
router.get('/',cookieCheck, controller.index);



module.exports = router;