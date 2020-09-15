var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const methodOverride = require('method-override'); //requiero el paquete Method Override para usar los metodos PUT, PATH y DELETE
const session = require('express-session'); //requiero express-session

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

let productsRouter = require('./routes/products') //requiero el módulo que se hará cargo de la administración de las rutas relacionadas con productos

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(methodOverride('_method')) //configuro el uso de method Override
app.use(session({secret:"mercadoLiebreForEver"})) //configuro el uso de session

app.use(function(req,res,next){
    req.session.urlAnterior = req.originalUrl;
    next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/products', productsRouter) //añado la ruta principal de productos de la cual derivarán todas las demás

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;