const path = require('path'); //requiero el paquete de path
const multer = require('multer'); //requiero el paquete de multer para manejar archivos

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/users')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload =  multer({
    storage: storage,
})



module.exports = upload