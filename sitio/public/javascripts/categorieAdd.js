const qs = function qs(element){
    return document.querySelector(element)
}

window.addEventListener('load',function(){
    console.log('JS vinculado correctamente...')

    // --> elementos
    let inputNombre = qs('#nombre');
    let inputLogo = qs('#logo');
    let vistaPrevia = qs('#vistaPrevia');

    // --> validaciones

    inputNombre.addEventListener('blur',function(){
        if(this.value == 0){
            this.classList.add('is-invalid');
            var error = "Debes indicar el nombre de la categoría"
            errorNombre.innerHTML = error
        }else{
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorNombre.innerHTML = ""
        }
    })

    inputLogo.addEventListener('change',function(e){

        let reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function(){
            vistaPrevia.src = reader.result;
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorLogo.innerHTML = "";
        };

        if(this.value == 0){
            this.classList.add('is-invalid');
            errorLogo.innerHTML = "Debe agregar una imagen del producto"
        }else{
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorLogo.innerHTML = ""
        }
    })

})