const dbUsers = require('../data/dbUsers');

module.exports = function(req,res,next){
    if(req.cookies.userMercadoLiebre){
        req.session.user = req.cookies.userMercadoLiebre;
        res.locals.user = req.session.user
        next()
    }else{
        res.locals.user = req.session.user
        next()
    }
}