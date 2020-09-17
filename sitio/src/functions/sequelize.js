// buscar todos los usuarios

db.Users.findAll()
.then(response =>{
    console.log(response)
})

// crear un usuario

db.Users.create({
    nombre:req.body.nombre.trim(),
    apellido:req.body.apellido.trim(),
    email:req.body.email.trim(),
    password:bcrypt.hashSync(req.body.pass.trim(),10),
    avatar:(req.files)?req.files[0].filename:null,
    rol:"user"
})
.then(result => {
    console.log(result)
    return res.redirect('/users/login')
})
.catch(err => {
    console.log(err)
    res.render('userRegister',{
        title: "Registro de usuario",
        css:"index.css",
        errors: errors.mapped(),
        old:req.body
    })
})