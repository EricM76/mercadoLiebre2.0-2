const qs = function qs(element){
    return document.querySelector(element);
}

window.addEventListener('load',function(){

    console.log('JS vinculado correctamente');

    // ---> elementos

    let form = qs('form#productAdd');

    let vistaPrevia = qs('#vistaPrevia');
   
    let inputNombre = qs('#nombre');
    let inputPrecio = qs('#precio');
    let inputDescuento = qs('#descuento');
    let textDescripcion = qs('#descripcion');
    let inputImagen = qs('#imagen');
    let selectCategoria = qs('#selectCategoria')
    let selectSub = qs('#selectSub');

    function ordenarAsc(p_array_json, p_key) {
        p_array_json.sort(function (a, b) {
           return a[p_key] > b[p_key];
        });
     }

    let subcategorias = function(idCategoria){
        selectSub.innerHTML = ""
        fetch(`${window.location.origin}/api/subcategorias/${idCategoria}`)
        .then(response => response.json())
        .then(subcategorias => {

           ordenarAsc(subcategorias,'nombre')

            subcategorias.forEach(subcategoria => {
                selectSub.innerHTML +=
                  `<option value="${subcategoria.id}">${subcategoria.nombre}</option>`
            });
        })
    }




    inputNombre.addEventListener('blur',function(){
        if(this.value == 0){
            this.classList.add('is-invalid');
            errorNombre.innerHTML = "Debe indicar el nombre del producto"
        }else{
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorNombre.innerHTML = ""
        }
    })

    selectCategoria.addEventListener('blur',function(){
        if(this.value == 0){
            this.classList.add('is-invalid');
            errorCategoria.innerHTML = "Debe indicar el nombre del producto"
        }else{
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorCategoria.innerHTML = ""
        }
    })

    inputPrecio.addEventListener('blur',function(){
        if(this.value < 1){
            this.classList.add('is-invalid');
            errorPrecio.innerHTML = "Debe indicar el precio del producto"
        }else{
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorPrecio.innerHTML = ""
        }
    })

    inputDescuento.addEventListener('blur',function(){
        if(this.value < 1){
            this.classList.add('is-invalid');
            errorDescuento.innerHTML = "Debe indicar el descuento del producto"
        }else{
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorDescuento.innerHTML = ""
        }
    })

    textDescripcion.addEventListener('blur',function(){
        if(this.value == 0){
            this.classList.add('is-invalid');
            errorDescripcion.innerHTML = "Debe indicar la descripción del producto"
        }else{
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorDescripcion.innerHTML = ""
        }
    })

    inputImagen.addEventListener('blur',function(){
        if(this.value == ""){
            this.classList.add('is-invalid');
            errorImagen.innerHTML = "Debe agregar una imagen del producto"
        }else{
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorImagen.innerHTML = ""
        }
    })

    inputImagen.addEventListener('change',function(e){
        let reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function(){
          vistaPrevia.src = reader.result;
          labelImagen.innerHTML = e.files[0].name
        };
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        errorImagen.innerHTML = "";
})

    selectCategoria.addEventListener('change',()=>{
        subcategorias(selectCategoria.value)
        })
    





})