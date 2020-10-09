
window.addEventListener("load",function(){
  let provinciaSelect = document.querySelector('#provinciaSelect') //capto el select
  let ciudadSelect = document.querySelector('#ciudadSelect')
  let inputProvincia = document.querySelector('#inputProvincia')
  let inputCiudad = document.querySelector('#inputCiudad')

    /* ----------> VISTA PREVIA DE LA IMAGEN DE PERFIL < ------- */
    // ------------------------documentación -------------------//
    // https://developer.mozilla.org/es/docs/Web/API/FileReader //

    document.querySelector("#avatarImput").onchange = function(e) {
        // Creamos el objeto de la clase FileReader
        let reader = new FileReader();

        // Leemos el archivo subido y se lo pasamos a nuestro fileReader
        reader.readAsDataURL(e.target.files[0]);

        // Le decimos que cuando este listo ejecute el código interno
        reader.onload = function(){
          let imagen = document.querySelector('.avatarImg')
          imagen.src = reader.result;
        };
      }

 // ----> cuanto el foco está puesto sobre el input, se oculta el input y se muestra el select con las provincias. Cuando se elige una, el select se oculta y queda el input con el valor designado
      inputProvincia.addEventListener('focus',function(){
        this.style.display = "none";
        provinciaSelect.style.display = "block";
 

      /* ----------> APIS DE PROVINCIAS Y CIUDADES < ------- */
      fetch('https://apis.datos.gob.ar/georef/api/provincias')
      .then(function(response){
          return response.json();
      })
      .then(function(result){

            for (let index = provinciaSelect.options.length; index>=0; index--) {
              provinciaSelect.remove(index)
            } //borro los items

            result.provincias.sort(function(prev,next){ //ordeno las provincias
              return prev.id - next.id
            })

            provinciaSelect.innerHTML +=`<option>Seleccione su provincia... </option>`

            result.provincias.forEach(provincia => {
            provinciaSelect.innerHTML += `<option value=${provincia.id}> ${provincia.nombre} </option>` //agrego un option con el nombre de la provincia cargado
        
           })
           provinciaSelect.addEventListener('change',function(){
            this.style.display = "none";
            inputProvincia.style.display = "block";
            inputProvincia.value = this.options[provinciaSelect.selectedIndex].text
        })
      })
    })

// ----> cuanto el foco está puesto sobre el input, se oculta el input y se muestra el select con las localidades correpondientes con la provincia. Cuando se elige una, el select se oculta y queda el input con el valor designado
      inputCiudad.addEventListener('focus',function(){
        this.style.display = "none";
        ciudadSelect.style.display = "block";
        fetch('https://apis.datos.gob.ar/georef/api/localidades?max=1000&provincia='+inputProvincia.value)
        .then(response => {
          return response.json();
        })
        .then(result => {
          for(let i = ciudadSelect.options.length; i>=0; i--){
            ciudadSelect.remove(i)
          } //borro los datos

          result.localidades.sort(function(prev,next){ //ordeno las localidades
            return prev.nombre > next.nombre
          })

          ciudadSelect.innerHTML +=`<option>Seleccione su localidad... </option>`

          result.localidades.forEach(localidad => {
              ciudadSelect.innerHTML += `<option value=${localidad.id}> ${localidad.nombre} </option>` //agrego un option con el nombre de la provincia cargado
          })
          ciudadSelect.addEventListener('change',function(){
            this.style.display = "none";
            inputCiudad.style.display = "block";
            inputCiudad.value = this.options[ciudadSelect.selectedIndex].text
        })
        })
      })

})