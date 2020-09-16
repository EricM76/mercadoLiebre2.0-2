module.exports = function sessionUserCheck(req,res,next){
    if(req.session.user){
        res.locals.user = req.session.user;
        //console.log(res.locals.user)
        next()
    }else{
        req.session.url = req.originalUrl;
        res.redirect('/users/login')
    }
}