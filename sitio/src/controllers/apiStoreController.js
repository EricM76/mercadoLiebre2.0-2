const db = require('../database/models')

module.exports = {
    tiendas: (req, res) => {
        db.Stores.findAll({
                attributes: [
                    "nombre"
                ]
            })
            .then(tiendas => res.status(200).json(tiendas))
            .catch(error => console.log(error))
    },
    emails: (req, res) => {
        db.Users.findAll({
                attributes: [
                    "email"
                ]
            })
            .then(emails => res.status(200).json(emails))
            .catch(error => console.log(error))
    }
}