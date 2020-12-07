
const qs = function (element){
    return document.querySelector(element);
}


window.addEventListener('load',function(){
    console.log('JS vinculado correctamente...');

    let formRegister = qs('form#register');

    let elementos = formRegister.elements;

    let inputNombre = qs('#nombre');
    let inputApellido = qs('#apellido');
    let inputEmail = qs('#email');
    let inputAvatar = qs('#avatar');
    let inputPass = qs('#pass');
    let inputPass2 = qs('#pass2');
    let checkBases = qs('.custom-control-input');
    let labelAvatar = qs('#labelAvatar');

    let regExEmail =  /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;

    let regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;

    inputNombre.addEventListener('blur',function(){
        switch (true) {
            case this.value == 0:
                errorNombre.innerHTML = "El campo nombre es obligatorio"
                this.classList.add('is-invalid')
                break;
            case this.value.trim().length <=2:
                errorNombre.innerHTML = "Tenés que poner al menos tres letras"
                this.classList.add('is-invalid')
                break
            default:
                this.classList.remove('is-invalid')
                this.classList.add('is-valid')
                errorNombre.innerHTML = ""
                break;
        }
    })

    inputApellido.addEventListener('blur',function(){
        switch (true) {
            case this.value == 0:
                errorApellido.innerHTML = "El campo apellido es obligatorio"
                this.classList.add('is-invalid')
                break;
            case this.value.trim().length <=2:
                errorApellido.innerHTML = "Tenés que poner al menos tres letras"
                this.classList.add('is-invalid')
                break
            default:
                this.classList.remove('is-invalid')
                this.classList.add('is-valid')
                errorApellido.innerHTML = ""
                break;
        }
    })

    inputEmail.addEventListener('blur',function(){

        switch (true) {
            case this.value == 0:
                errorEmail.innerHTML = "El campo email es obligatorio"
                this.classList.add('is-invalid')
                break;
            case !regExEmail.test(this.value):
                errorEmail.innerHTML = "Debes escribir un email válido"
                this.classList.add('is-invalid')
                break
            default:
                this.classList.remove('is-invalid')
                this.classList.add('is-valid')
                errorEmail.innerHTML = ""
                break;
        }
    })


    inputAvatar.addEventListener('change', function (e) {
        let regExExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
        switch (true) {
            case !regExExtensions.exec(this.value):
                errorAvatar.innerHTML = "Solo imagenes con extension jpg, jpeg, png, o gif";
                this.classList.add('is-invalid')
                this.value = '';
                vistaPrevia.src = "";
                break
            default:
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                errorAvatar.innerHTML = "";
                let reader = new FileReader();// Creamos el objeto de la clase FileReader
                reader.readAsDataURL(e.target.files[0]); // Leemos el archivo subido y se lo pasamos a nuestro fileReader
                reader.onload = function () {
                    vistaPrevia.src = reader.result;
                    labelAvatar.innerText = e.target.files[0].name
                };  // Le decimos que cuando este listo ejecute el código interno
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                errorAvatar.innerHTML = "";
        }

    })
        
    inputPass.addEventListener('blur',function(){
        switch (true) {
            case this.value == 0:
                errorPass.innerHTML = "El campo contraseña es obligatorio"
                this.classList.add('is-invalid')
                break;
            case !regExPass.test(this.value):
                errorPass.innerHTML = "La contraseña debe tener entre 6 y 12 caracteres, una mayúscula una minúscula y un número"
                this.classList.add('is-invalid')
                break
            default:
                this.classList.remove('is-invalid')
                this.classList.add('is-valid')
                errorPass.innerHTML = ""
                break;
        }
    })

    inputPass.addEventListener('mouseover',function(){
       this.setAttribute("title","La contraseña debe tener entre 6 y 12 caracteres, una mayúscula una minúscula y un número");
    })


    inputPass2.addEventListener('blur',function(){
        switch (true) {
            case this.value == 0:
                errorPass2.innerHTML = "Reingrese su contraseña"
                this.classList.add('is-invalid')
                break;
            case this.value != inputPass.value:
                errorPass2.innerHTML = "Las contraseñas no coinciden"
                this.classList.add('is-invalid')
                break;
            default:
                this.classList.remove('is-invalid')
                this.classList.add('is-valid')
                errorPass2.innerHTML = ""
                break;
        }
    })

    checkBases.addEventListener('click',function(){
            checkBases.classList.toggle('is-valid');
            checkBases.classList.remove('is-invalid');
            errorBases.innerHTML = ""
    })

    formRegister.addEventListener('submit',function(event){
        event.preventDefault();
        let error = false

        if(checkBases.checked == false){
            checkBases.classList.add('is-invalid');
            errorBases.innerHTML = "Debes aceptar las bases y condiciones"
            error = true

        }
        for (let index = 0; index < elementos.length-1; index++) {
            if(elementos[index].value == 0){
                elementos[index].classList.add('is-invalid');
               error = true;
            }
        }
        if(!error){
            formRegister.submit()
        }else{
            msgError.innerHTML = "Los campos señadados son obligatorios"
        }
    })

})