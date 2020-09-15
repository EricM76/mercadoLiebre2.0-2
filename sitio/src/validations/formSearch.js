const {check,validationResult,body} = require('express-validator');

module.exports = [
    check('search') //chequea que el campo de busqueda no venga vacía
    .notEmpty()
    .withMessage('no está buscando nada')
]