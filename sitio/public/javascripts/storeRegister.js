window.addEventListener('load', () => {
    console.log('JS vinculado perfectamente')
    let formulario = document.getElementById('formRegister');
    let elementos = formulario.elements;
    let inputLogo = elementos[0];
    let inputTienda = elementos[1];
    let inputNombre = elementos[2];
    let inputApellido = elementos[3];
    let inputEmail = elementos[4];
    let inputPass = elementos[5];
    let checkBases = elementos[6];


    inputLogo.addEventListener('change', function (e) {
        let regExExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
        switch (true) {
            case !regExExtensions.exec(this.value):
                errorLogo.innerHTML = "Solo imagenes con extension jpg, jpeg, png, o gif";
                this.classList.add('is-invalid')
                this.value = '';
                vistaPrevia.src = "";
                break
            default:
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                errorLogo.innerHTML = "";
                // Creamos el objeto de la clase FileReader
                let reader = new FileReader();
                // Leemos el archivo subido y se lo pasamos a nuestro fileReader
                reader.readAsDataURL(e.target.files[0]);
                // Le decimos que cuando este listo ejecute el código interno
                reader.onload = function () {
                    vistaPrevia.src = reader.result;
                };
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                errorLogo.innerHTML = "";
        }

    })

    
    inputTienda.addEventListener('blur',function(){
        switch (true) {
            case this.value == "":
                errorLogo.innerHTML = "Este campo es obligatorio";
                this.classList.add('is-invalid')
            break
            default:
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorLogo.innerHTML = "";
        }
    })

    inputTienda.addEventListener('blur', function () {
        switch (true) {
            case this.value.length == 0:
                errorTienda.innerHTML = "El nombre de la tienda es obligatorio";
                this.classList.add('is-invalid')
                break;
            case this.value.trim().length <= 2:
                errorTienda.innerHTML = "Tenés que poner al menos 3 letras";
                this.classList.add('is-invalid')
                break;
            default:
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                errorTienda.innerHTML = "";
        }
    })

    inputTienda.addEventListener('change',()=>{
        fetch(`${window.location.origin}/api/tiendas`)
        .then(response => response.json())
        .then(tiendas => {
           tiendas.forEach(tienda => {
            if (tienda.nombre == inputTienda.value){
                errorTienda.innerHTML = "La tienda ya está registrada";
                inputTienda.classList.toggle('is-invalid')
            }
           })
            
        })
    })

    inputNombre.addEventListener('blur', function () {
        switch (true) {
            case this.value.length == 0:
                errorNombre.innerHTML = "El campo nombre es obligatorio";
                this.classList.add('is-invalid')
                break;
            case this.value.trim().length <= 2:
                errorNombre.innerHTML = "Tenés que poner al menos 3 letras";
                this.classList.add('is-invalid')
                break;
            default:
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                errorNombre.innerHTML = "";
        }
    })

    inputApellido.addEventListener('blur', function () {
        switch (true) {
            case this.value.length == 0:
                errorApellido.innerHTML = "El campo apellido es obligatorio";
                this.classList.add('is-invalid')
                break;
            case this.value.trim().length <= 2:
                errorApellido.innerHTML = "Tenés que poner al menos 3 letras";
                this.classList.add('is-invalid')
                break;
            default:
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                errorApellido.innerHTML = "";
        }
    })

    inputEmail.addEventListener('blur', function () {
        let regExEmail = /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
        switch (true) {
            case this.value == "":
                errorEmail.innerHTML = "El campo email es obligatorio";
                this.classList.add('is-invalid')
                break
            case !regExEmail.test(this.value):
                errorEmail.innerHTML = "Debes escribir un email válido";
                this.classList.add('is-invalid')
                break;
            default:
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                errorEmail.innerHTML = "";
        }
    })
    
    inputEmail.addEventListener('change',() =>{
        fetch(`${window.location.origin}/api/emails`)
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                if (user.email == inputEmail.value){
                    errorEmail.innerHTML = "Este email ya está registrado";
                    inputEmail.classList.toggle('is-invalid')
                }
               })
            
        })
    })

    inputPass.addEventListener('blur', function () {
        let regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
        switch (true) {
            case this.value == "":
                errorPass.innerHTML = "El campo contraseña es obligatorio";
                this.classList.add('is-invalid')
                break
            case !regExPass.test(this.value):
                errorPass.innerHTML = "La contraseña debe tener entre 6 y 12 caracteres y contener al menos un numero, una minúscula y una mayúscula";
                this.classList.add('is-invalid')
                break;
            default:
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                errorPass.innerHTML = "";
        }
    })

    checkBases.addEventListener('click', function () {
        checkBases.classList.toggle('is-valid');
        checkBases.classList.remove('is-invalid');
        errorBases.innerHTML = ""
    })

    formRegister.addEventListener('submit', function (event) {
        event.preventDefault();
        if (checkBases.checked == false) {
            checkBases.classList.add('is-invalid');
            errorBases.innerHTML = "Debes aceptar las bases y condiciones"
        }
        let error = false
        for (let index = 0; index < elementos.length - 1; index++) {
            if (elementos[index].value == 0) {
                elementos[index].classList.add('is-invalid');
                error = true;
            }
        }
        if (!error) {
            formRegister.submit()
        } else {
            msgError.innerHTML = "Los campos señadados son obligatorios"
        }
    })


})