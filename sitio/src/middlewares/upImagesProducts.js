const path = require('path'); //requiero el paquete de path
const multer = require('multer'); //requiero el paquete de multer para manejar archivos


let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/products')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

module.exports = multer({ storage: storage })

